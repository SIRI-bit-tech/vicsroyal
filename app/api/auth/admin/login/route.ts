import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { adminUsers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, createAdminSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const users = await db.select().from(adminUsers).where(eq(adminUsers.email, cleanEmail)).limit(1);

    if (users.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const admin = users[0];
    const isValid = await verifyPassword(password, admin.passwordHash);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    await createAdminSession(admin.id, admin.email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging in admin:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
