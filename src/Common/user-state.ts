type UserState = 'firstname' | 'lastname' | 'age' | 'contact'

interface UserData {
    step: UserState
    data: {
        firstname?: string
        lastname?: string
        age?: number
        contact?: string
    }
}

export const userState = new Map<number, UserData>()
