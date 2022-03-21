CREATE TABLE IF NOT EXISTS GameTable {
    userID TEXT PRIMARY KEY,
    tableID INTEGER NOT NULL,
    FOREIGN KEY (userID) REFERENCES Users(userID)
};

CREATE TABLE IF NOT EXISTS Users {
    userID TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    hash TEXT UNIQUE NOT NULL,
    winStreak INTEGER DEFAULT 0 NOT NULL CHECK(winStreak >= 0)
};