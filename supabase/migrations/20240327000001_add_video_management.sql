-- Add new columns to music_videos table
ALTER TABLE music_videos
ADD COLUMN is_hidden BOOLEAN DEFAULT FALSE,
ADD COLUMN click_count INTEGER DEFAULT 0,
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());

-- Create an index for faster sorting by click_count
CREATE INDEX idx_music_videos_click_count ON music_videos(click_count DESC);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_music_videos_updated_at
    BEFORE UPDATE ON music_videos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies for the new columns
ALTER POLICY "Enable read access for all users" ON music_videos
    USING (NOT is_hidden);

ALTER POLICY "Enable insert for authenticated users only" ON music_videos
    WITH CHECK (auth.role() = 'authenticated');

ALTER POLICY "Enable update for authenticated users only" ON music_videos
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

ALTER POLICY "Enable delete for authenticated users only" ON music_videos
    USING (auth.role() = 'authenticated'); 