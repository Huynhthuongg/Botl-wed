
/*
  # AI Chat Application Schema

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key)
      - `title` (text) - conversation title
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `messages`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, FK to conversations)
      - `role` (text) - 'user' or 'assistant'
      - `content` (text) - message content
      - `created_at` (timestamptz)

  2. Security
    - RLS enabled on both tables
    - Public read/write allowed for demo purposes (no auth required for this app)

  3. Notes
    - Messages are linked to conversations via foreign key
    - Cascade delete removes messages when conversation is deleted
*/

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'New Conversation',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read conversations"
  ON conversations FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert conversations"
  ON conversations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update conversations"
  ON conversations FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete conversations"
  ON conversations FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow public read messages"
  ON messages FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert messages"
  ON messages FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public delete messages"
  ON messages FOR DELETE
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
