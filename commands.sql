CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INT DEFAULT 0

);

INSERT INTO blogs (author, url, title) VALUES ("Ernest Hemingway","www.ernestblogs.com",  "Golden Plains of Stranglethorn")