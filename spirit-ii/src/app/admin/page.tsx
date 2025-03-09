import { redirect } from 'next/navigation';

// Redirect to players page
export default function AdminIndexPage() {
  redirect('/admin/players');
}