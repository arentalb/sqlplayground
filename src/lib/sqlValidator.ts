// utils/sqlValidator.ts

// Restricted SQL patterns to prevent unauthorized actions
const restrictedCommands: RegExp[] = [
  /^SELECT.*FROM\s+pg_catalog\./i, // Prevent access to system catalog tables
  /^SELECT.*FROM\s+information_schema\./i, // Prevent access to information_schema
  /\bDROP\s+DATABASE\b/i, // Prevent DROP DATABASE command
  /\bALTER\s+DATABASE\b/i, // Prevent ALTER DATABASE command
  /\bRENAME\s+DATABASE\b/i, // Prevent RENAME DATABASE command
  /\b(GRANT|REVOKE)\b/i, // Prevent privilege changes
  /\bSHOW\s+(DATABASES|GRANTS|ROLES)\b/i, // Prevent access to other databases or user roles
  /\bpg_stat_activity\b|\bpg_stat_replication\b/i, // Prevent access to server stats tables
  /\bFROM\s+[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+\b/i, // Prevent cross-database access
  /\bCOPY\s+TO\b/i, // Prevent copying data out of the database
  /\bplperlu\b|\bplpythonu\b/i, // Prevent untrusted language access
  /\b(LISTEN|NOTIFY)\b/i, // Prevent interprocess communication commands
  /\bTRUNCATE\b/i, // Optional: Prevent accidental data truncation
];

/**
 * Validates if the SQL query is permitted.
 * @param query - The SQL query to validate.
 * @param allowedDb - The name of the database the user is allowed to query.
 * @returns Returns true if the query is allowed; otherwise false.
 */
export function isQueryAllowed(query: string, allowedDb: string): boolean {
  // Normalize query to avoid case sensitivity
  const normalizedQuery = query.toUpperCase();

  // Check if any restricted command is found in the query
  if (restrictedCommands.some((cmd) => cmd.test(normalizedQuery))) {
    return false;
  }

  // Ensure queries reference only the allowed database
  const dbRegex = new RegExp(`\\b${allowedDb}\\b`, "i");
  if (!dbRegex.test(query) && /USE\s+/i.test(query)) {
    return false;
  }

  return true;
}
