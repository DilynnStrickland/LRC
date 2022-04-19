CREATE TABLE IF NOT EXISTS Users {
    userID TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    passwordHash TEXT UNIQUE NOT NULL,
    winStreak INTEGER DEFAULT 0 NOT NULL CHECK(winStreak >= 0)
};

CREATE TABLE IF NOT EXISTS GameTable {
    tableID INTEGER PRIMARY KEY NOT NULL,
    userID TEXT,
    FOREIGN KEY (userID) REFERENCES Users(userID) -- fix this for non-account play
};
