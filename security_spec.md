# Security Specification for Jivagreen

## Data Invariants
1. A User profile must exist for any authenticated action.
2. A Waste listing must have a valid sellerId matching the creator.
3. points and role in User documents must ONLY be modifiable by Admins.
4. Withdrawal requests must match the user's available points.
5. Terminal states for requests are immutable.

## Attack Vectors Protected
1. Identity Theft (Updating others' profiles)
2. Privilege Escalation (Self-assigning ADMIN role)
3. Point Injection (Modifying balance directly)
4. State Shortcutting (Bypassing approval logic)
5. Resource Poisoning (Large string IDs or Fields)
