'use client';

import { useLoginRequired } from '@/hooks/useLoginRequired';

export default function Home() {
  useLoginRequired();
  return null;
}
