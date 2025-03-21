interface Organization {
    id: number
    name: string
}

interface User {
    id: number
    firstName: string
    lastName: string
    email: string
    roles: string[]
    organizations: Organization[]
    results: {
        general: { overall: number }
        technical: { overall: number }
        interview?: { overall: number }
    }
}