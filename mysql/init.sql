SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS options (
    id INT PRIMARY KEY AUTO_INCREMENT,
    label CHAR(1) NOT NULL,
    text VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    votes INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO options (label, text, votes) VALUES
    ('A', '0 - Káva je pro slabochy', 0),
    ('B', '1-2 - Rozumná dávka', 0),
    ('C', '3-4 - Produktivní závislák', 0),
    ('D', '5+ - Krev je jen nosič kofeinu', 0);
