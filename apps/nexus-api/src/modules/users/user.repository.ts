import { supabase } from "@/lib/supabase.js";

export class UserRepository {
    constructor () {}

    getUserById = async(userId: string) =>{
        return await supabase.from('user').select('*').eq('id', userId).single();
    }
}



export const userRepositoryInstance = new UserRepository();