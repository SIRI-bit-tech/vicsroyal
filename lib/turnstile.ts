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
  const secret = process.env.TURNSTILE_SECRET || '1x0000000000000000000000000000000AA'; // Cloudflare test secret fallback

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
      console.error(`Turnstile siteverify HTTP error: ${response.status}`);
      return { success: false, errorCodes: ['siteverify-http-error'] };
    }

    const data = await response.json();
    return {
      success: Boolean(data.success),
      action: data.action,
      hostname: data.hostname,
      errorCodes: data['error-codes'] || [],
    };
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return { success: false, errorCodes: ['internal-fetch-error'] };
  }
}
