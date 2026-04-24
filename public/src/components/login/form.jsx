import { useState } from "react";
import Input from "./input"


const Form = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username, password);
    }


    return(
        <div className="bg-white-900/30 backdrop-blur rounded-xl p-8 flex flex-col gap-6 w-full max-w-sm border border-black/10 shadow-lg shadow-gray-900/50">
        <h2 className="text-white text-2xl font-bold text-center">Semendick Royale</h2>
        <Input label="Usuario" id="username" type="text"  onChange={setUsername} placeholder="Usuario" />
        <Input label="Contraseña" id="password" type="password"  onChange={setPassword} placeholder="Contraseña" />
        <button type="submit" className="w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-all active:scale-95 shadow-lg uppercase tracking-tighter">
            Entrar
        </button>
    </div>
    )
}

export default Form