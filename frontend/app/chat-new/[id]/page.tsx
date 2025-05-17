import { createSupabaseServer } from '@/lib/supabase/server';
import { Chat } from '../components/chat';
import { notFound } from 'next/navigation';

export default async function ChatPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the conversation to verify it exists and user has access
  const { data: conversation } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .single();

  if (!conversation) {
    notFound();
  }

  // Verify user has access to this conversation
  if (conversation.user_id !== user?.id) {
    notFound();
  }

  // Fetch messages for this conversation
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true });

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={messages || []}
      selectedModelId="openai"
      selectedVisibilityType="private"
      isReadonly={!user}
    />
  );
}
