-- For getting columns
SELECT
    tc.constraint_name,
    tc.table_name AS local_table,
    kcu.column_name AS local_column,
    ccu.table_name AS referenced_table,
    ccu.column_name AS referenced_column
FROM
    information_schema.table_constraints AS tc
        JOIN
    information_schema.key_column_usage AS kcu
    ON
            tc.constraint_name = kcu.constraint_name
        JOIN
    information_schema.constraint_column_usage AS ccu
    ON
            ccu.constraint_name = tc.constraint_name
WHERE
        tc.constraint_type = 'FOREIGN KEY';

-- For getting foreign key constraint
WITH PrimaryKeys AS (
    SELECT
        kcu.table_schema,
        kcu.table_name,
        kcu.column_name,
        'PRIMARY KEY' AS key_type
    FROM
        information_schema.table_constraints AS tc
            JOIN
        information_schema.key_column_usage AS kcu
        ON
                tc.constraint_name = kcu.constraint_name
    WHERE
            tc.constraint_type = 'PRIMARY KEY'
)
                                  SELECT
                                      c.table_schema,
                                      c.table_name,
                                      c.column_name,
                                      c.data_type,
                                      COALESCE(pk.key_type, 'NONE') AS key_type
                                  FROM
                                      information_schema.columns AS c
                                          LEFT JOIN
                                      PrimaryKeys pk
                                      ON
                                                  c.table_schema = pk.table_schema
                                              AND c.table_name = pk.table_name
                                              AND c.column_name = pk.column_name
                                  WHERE
                                          c.table_schema NOT IN ('information_schema', 'pg_catalog')
                                  ORDER BY
                                      c.table_schema, c.table_name, c.ordinal_position;
