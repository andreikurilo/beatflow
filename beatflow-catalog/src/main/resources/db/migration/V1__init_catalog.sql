CREATE TABLE artists
(
    id   UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE albums
(
    id           UUID PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    artist_id    UUID         NOT NULL,
    release_date DATE,
    cover_url TEXT,
    CONSTRAINT fk_album_artist
        FOREIGN KEY (artist_id) REFERENCES artists (id)
);

CREATE TABLE tracks
(
    id               UUID PRIMARY KEY,
    title            VARCHAR(255) NOT NULL,
    album_id         UUID         NOT NULL,
    duration_seconds INT          NOT NULL,
    audio_url        TEXT,
    license_source   VARCHAR(100),
    license_url      TEXT,
    source_url       TEXT,
    CONSTRAINT fk_track_album
        FOREIGN KEY (album_id) REFERENCES albums (id)
);

CREATE TABLE genres
(
    id   UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE track_genres
(
    track_id UUID NOT NULL,
    genre_id UUID NOT NULL,
    PRIMARY KEY (track_id, genre_id),
    CONSTRAINT fk_track_genres_track
        FOREIGN KEY (track_id) REFERENCES tracks (id) ON DELETE CASCADE,
    CONSTRAINT fk_track_genres_genre
        FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE CASCADE
);


INSERT INTO artists (id, name) VALUES
                                   ('11111111-1111-1111-1111-111111111111', 'AberrantRealities'),
                                   ('22222222-2222-2222-2222-222222222222', 'Alec_Koff'),
                                   ('33333333-3333-3333-3333-333333333333', 'AlexGrohl'),
                                   ('44444444-4444-4444-4444-444444444444', 'Anomy5'),
                                   ('55555555-5555-5555-5555-555555555555', 'Cosmonkey'),
                                   ('66666666-6666-6666-6666-666666666666', 'Denys Brodovskyi'),
                                   ('77777777-7777-7777-7777-777777777777', 'GiorgioVitte'),
                                   ('88888888-8888-8888-8888-888888888888', 'ItsWatr'),
                                   ('99999999-9999-9999-9999-999999999999', 'Kontraa'),
                                   ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'StudioKolomna');

INSERT INTO albums (id, title, artist_id, release_date, cover_url) VALUES
                                                                       ('10000000-0000-0000-0000-000000000001', 'Singles', '11111111-1111-1111-1111-111111111111', NULL, NULL),
                                                                       ('10000000-0000-0000-0000-000000000002', 'Singles', '22222222-2222-2222-2222-222222222222', NULL, NULL),
                                                                       ('10000000-0000-0000-0000-000000000003', 'Singles', '33333333-3333-3333-3333-333333333333', NULL, NULL),
                                                                       ('10000000-0000-0000-0000-000000000004', 'Singles', '44444444-4444-4444-4444-444444444444', NULL, NULL),
                                                                       ('10000000-0000-0000-0000-000000000005', 'Singles', '55555555-5555-5555-5555-555555555555', NULL, NULL),
                                                                       ('10000000-0000-0000-0000-000000000006', 'Singles', '66666666-6666-6666-6666-666666666666', NULL, NULL),
                                                                       ('10000000-0000-0000-0000-000000000007', 'Singles', '77777777-7777-7777-7777-777777777777', NULL, NULL),
                                                                       ('10000000-0000-0000-0000-000000000008', 'Singles', '88888888-8888-8888-8888-888888888888', NULL, NULL),
                                                                       ('10000000-0000-0000-0000-000000000009', 'Singles', '99999999-9999-9999-9999-999999999999', NULL, NULL),
                                                                       ('10000000-0000-0000-0000-00000000000a', 'Singles', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, NULL);

INSERT INTO genres (id, name) VALUES
                                  ('20000000-0000-0000-0000-000000000001', 'Electronic'),
                                  ('20000000-0000-0000-0000-000000000002', 'Blues'),
                                  ('20000000-0000-0000-0000-000000000003', 'Rock'),
                                  ('20000000-0000-0000-0000-000000000004', 'Phonk'),
                                  ('20000000-0000-0000-0000-000000000005', 'Hip-Hop'),
                                  ('20000000-0000-0000-0000-000000000006', 'Trap'),
                                  ('20000000-0000-0000-0000-000000000007', 'Chill'),
                                  ('20000000-0000-0000-0000-000000000008', 'Flamenco');

INSERT INTO tracks (
    id,
    title,
    album_id,
    duration_seconds,
    audio_url,
    license_source,
    license_url,
    source_url
) VALUES
      ('30000000-0000-0000-0000-000000000001', 'Organic Flow 1015 Remastered', '10000000-0000-0000-0000-000000000001', 180, 'tracks/aberrantrealities-organic-flow-1015-remastered-485950.mp3', 'Pixabay', 'https://pixabay.com/service/license-summary/', 'https://pixabay.com/music/'),
      ('30000000-0000-0000-0000-000000000002', 'Blues Ballad', '10000000-0000-0000-0000-000000000002', 152, 'tracks/alec_koff-blues-ballad-487408.mp3', 'Pixabay', 'https://pixabay.com/service/license-summary/', 'https://pixabay.com/music/'),
      ('30000000-0000-0000-0000-000000000003', 'Energetic Action Sport', '10000000-0000-0000-0000-000000000003', 106, 'tracks/alexgrohl-energetic-action-sport-500409.mp3', 'Pixabay', 'https://pixabay.com/service/license-summary/', 'https://pixabay.com/music/'),
      ('30000000-0000-0000-0000-000000000004', 'Aggressive Sport Phonk', '10000000-0000-0000-0000-000000000004', 120, 'tracks/anomy5-aggressive-sport-phonk-464391.mp3', 'Pixabay', 'https://pixabay.com/service/license-summary/', 'https://pixabay.com/music/'),
      ('30000000-0000-0000-0000-000000000005', 'Dark Electronic', '10000000-0000-0000-0000-000000000004', 120, 'tracks/anomy5-dark-electronic-464393.mp3', 'Pixabay', 'https://pixabay.com/service/license-summary/', 'https://pixabay.com/music/'),
      ('30000000-0000-0000-0000-000000000006', 'Phonk Phonk Music', '10000000-0000-0000-0000-000000000004', 120, 'tracks/anomy5-phonk-phonk-music-467523.mp3', 'Pixabay', 'https://pixabay.com/service/license-summary/', 'https://pixabay.com/music/'),
      ('30000000-0000-0000-0000-000000000007', 'Sad Chill Phonk', '10000000-0000-0000-0000-000000000004', 120, 'tracks/anomy5-sad-chill-phonk-464392.mp3', 'Pixabay', 'https://pixabay.com/service/license-summary/', 'https://pixabay.com/music/'),
      ('30000000-0000-0000-0000-000000000008', 'Dont Talk', '10000000-0000-0000-0000-000000000005', 180, 'tracks/cosmonkey-dont-talk-315229.mp3', 'Pixabay', 'https://pixabay.com/service/license-summary/', 'https://pixabay.com/music/'),
      ('30000000-0000-0000-0000-000000000009', 'Sandbreaker', '10000000-0000-0000-0000-000000000006', 180, 'tracks/denys_brodovskyi-sandbreaker-379630.mp3', 'Pixabay', 'https://pixabay.com/service/license-summary/', 'https://pixabay.com/music/'),
      ('30000000-0000-0000-0000-00000000000a', 'Berry Groovy Bass Trap', '10000000-0000-0000-0000-000000000007', 180, 'tracks/giorgiovitte-berry-groovy-bass-trap-476603.mp3', 'Pixabay', 'https://pixabay.com/service/license-summary/', 'https://pixabay.com/music/'),
      ('30000000-0000-0000-0000-00000000000b', 'Soulsweeper', '10000000-0000-0000-0000-000000000008', 180, 'tracks/itswatr-soulsweeper-252499.mp3', 'Pixabay', 'https://pixabay.com/service/license-summary/', 'https://pixabay.com/music/'),
      ('30000000-0000-0000-0000-00000000000c', 'Hype Drill Music', '10000000-0000-0000-0000-000000000009', 180, 'tracks/kontraa-hype-drill-music-438398.mp3', 'Pixabay', 'https://pixabay.com/service/license-summary/', 'https://pixabay.com/music/'),
      ('30000000-0000-0000-0000-00000000000d', 'No Sleep Hiphop Music', '10000000-0000-0000-0000-000000000009', 180, 'tracks/kontraa-no-sleep-hiphop-music-473847.mp3', 'Pixabay', 'https://pixabay.com/service/license-summary/', 'https://pixabay.com/music/'),
      ('30000000-0000-0000-0000-00000000000e', 'No Copyright Music', '10000000-0000-0000-0000-00000000000a', 180, 'tracks/studiokolomna-no-copyright-music-483817.mp3', 'Pixabay', 'https://pixabay.com/service/license-summary/', 'https://pixabay.com/music/'),
      ('30000000-0000-0000-0000-00000000000f', 'Spanish Flamenco', '10000000-0000-0000-0000-00000000000a', 180, 'tracks/studiokolomna-spanish-flamenco-247239.mp3', 'Pixabay', 'https://pixabay.com/service/license-summary/', 'https://pixabay.com/music/');

INSERT INTO track_genres (track_id, genre_id) VALUES
                                                  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001'),
                                                  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002'),
                                                  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003'),
                                                  ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004'),
                                                  ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001'),
                                                  ('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000004'),
                                                  ('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000004'),
                                                  ('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000007'),
                                                  ('30000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000005'),
                                                  ('30000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000001'),
                                                  ('30000000-0000-0000-0000-00000000000a', '20000000-0000-0000-0000-000000000006'),
                                                  ('30000000-0000-0000-0000-00000000000b', '20000000-0000-0000-0000-000000000007'),
                                                  ('30000000-0000-0000-0000-00000000000c', '20000000-0000-0000-0000-000000000005'),
                                                  ('30000000-0000-0000-0000-00000000000d', '20000000-0000-0000-0000-000000000005'),
                                                  ('30000000-0000-0000-0000-00000000000e', '20000000-0000-0000-0000-000000000001'),
                                                  ('30000000-0000-0000-0000-00000000000f', '20000000-0000-0000-0000-000000000008');
