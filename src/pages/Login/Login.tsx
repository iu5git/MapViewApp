import React, { useState } from "react";

import './Login.scss';

import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import { Text } from "../../components/Text/Text";

import { useNavigate } from "react-router";
import { useLoginMutation } from "../../api/paths/userApi";
import { useAppDispatch } from "../../store/hooks";
import { updateToken } from "../../store/features/user";

export const Login: React.FC = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [ name, setName ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ error, setError ] = useState('');

    const [ login ] = useLoginMutation();

    const loginFunction = (nameString: string, passwordString: string) => {
        login({
            name: nameString,
            password: passwordString
        })
        .then((res: any) => {
            console.log(res);
            if (!res.error) {
                return res.data;
            } else {
                throw new Error(res.error.data.errors.join(' '));
            }
        })
        .then((data: any) => {
            dispatch(updateToken({
                user: data.user,
                accessToken: data.access_token,
            }));
            navigate('/');
        })
        .catch((error: any) => {
            setError(error.message);
        });
    }

    return (
        <div className='login-page'>
            <Text type='h1'>Вход</Text>
            <form action='login-action' method='post'>
                <Input 
                    placeholder='Логин' 
                    inputType='base'
                    value={name}
                    onChange={(e: any) => {
                        setName(e.target.value);
                    }}
                />
                <Input 
                    placeholder='Пароль' 
                    inputType='password'
                    value={password}
                    onChange={(e: any) => {
                        setPassword(e.target.value);
                    }} 
                />
                <Text tag='div' type='small-text' color='error'>{error}</Text>
                <Button 
                    buttonType='blue'
                    onClick={() => { loginFunction(name, password) }}
                >
                    Войти
                </Button>
                <Text 
                    tag='div'
                    type='text-help-link'
                    color='link' 
                    onClick={() => { loginFunction('user', 'user') }}
                >
                    Продолжить без авторизации
                </Text>
            </form>
        </div>
    )
}