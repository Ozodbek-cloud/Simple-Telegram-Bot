type UserState = 'subscription'|  'country' | 'firstname' | 'lastname' | 'age' | 'contact'

interface UserData {
    step: UserState
    data: {
        firstname?: string
        lastname?: string
        age?: number
        country?: string
        contact?: string
    }
}

export const userState = new Map<number, UserData>()
