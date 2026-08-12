import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { adminUsers } from '@/db/schema';
import { hashPassword, createAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const existingAdmins = await db.select({ id: adminUsers.id }).from(adminUsers).limit(1);
    const locked = existingAdmins.length > 0;
    return NextResponse.json({ isLocked: locked });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ isLocked: false }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const existingAdmins = await db.select({ id: adminUsers.id }).from(adminUsers).limit(1);
    if (existingAdmins.length > 0) {
      return NextResponse.json(
        { error: 'Admin setup is locked. Only one admin account is permitted.' },
        { status: 403 }
      );
    }

    const { email, password } = await req.json();
    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: 'Email and password (min 6 chars) are required' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const [newAdmin] = await db
      .insert(adminUsers)
      .values({ email: email.toLowerCase().trim(), passwordHash })
      .returning();

    await createAdminSession(newAdmin.id, newAdmin.email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error registering admin:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
