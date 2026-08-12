export interface TurnstileVerifyResult {
  success: boolean;
  action?: string;
  hostname?: string;
  errorCodes?: string[];
}

export async function verifyTurnstileToken(
  token: string,
  expectedAction = 'checkout',
  clientIp?: string
): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET;

  // If secret is missing or unconfigured in production Vercel env, bypass with warning to avoid blocking legitimate sales
  if (!secret || secret === '1x0000000000000000000000000000000AA') {
    if (!token) {
      console.warn('[Turnstile] Secret key unconfigured or using test secret. Bypassing check.');
    }
    return { success: true };
  }

  if (!token || typeof token !== 'string' || token.length > 2048) {
    return { success: false, errorCodes: ['missing-input-response'] };
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret,
        response: token,
        ...(clientIp ? { remoteip: clientIp } : {}),
      }),
    });

    if (!response.ok) {
      console.error(`[Turnstile] siteverify HTTP error: ${response.status}`);
      return { success: true }; // Fail open if Cloudflare API is temporarily unreachable
    }

    const data = await response.json();

    // If Cloudflare returns invalid-input-secret (mismatched keys in Vercel), fail open & warn admin
    if (!data.success && Array.isArray(data['error-codes']) && data['error-codes'].includes('invalid-input-secret')) {
      console.warn('[Turnstile WARNING] Your TURNSTILE_SECRET in Vercel does not match your sitekey. Please check Cloudflare Dashboard keys.');
      return { success: true };
    }

    return {
      success: Boolean(data.success),
      action: data.action,
      hostname: data.hostname,
      errorCodes: data['error-codes'] || [],
    };
  } catch (error) {
    console.error('[Turnstile] siteverify exception:', error);
    return { success: true }; // Fail open on network exception
  }
}
