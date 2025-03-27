CREATE OR REPLACE FUNCTION increment_click_count(video_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_record json;
BEGIN
  UPDATE music_videos
  SET click_count = click_count + 1
  WHERE id = video_id
  RETURNING to_json(music_videos.*) INTO updated_record;
  
  RETURN updated_record;
END;
$$; 