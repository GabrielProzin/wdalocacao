'use client';
import { ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

const ALLOWED_UID = process.env.NEXT_PUBLIC_ALLOWED_UID!;
