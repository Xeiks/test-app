import { createDirectus, authentication, rest, login, readItems, createItem, readUsers, readRole, deleteItem, updateRelation, readRelationByCollection, readUser, readMe } from '@directus/sdk';
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from 'react';

export default function MainScreen() {
    const location = useLocation();
    const password = location.state.password;
    const email = location.state.email;
    const auth = location.state.auth;
    const [documents, setDoucments] = useState([]);
    const [signatories, setSignatories] = useState([]);
    const client = createDirectus('http://localhost:8010/proxy').with(authentication('json')).with(rest());
    const getSignatories = async () => {
        let result = await client.request(readUsers())
        setSignatories(result);
    }

    const checkSignatore = async (signatore_id, document_id) => {
        let result = await client.login(email, password);
        result = await client.request(readItems('Documents_directus_users'))
        result.map(signatore => {
            if(signatore.directus_users_id == signatore_id && signatore.Documents_id == document_id) {
                return false;
            }
        })
        return true;
    }

    const getDocuments = async () => {
        let result = await client.login(email, password);
        result = await client.request(readItems('Documents'))
        setDoucments(result);
        console.log(result);   
    }
    
    const signDocument = async (document_id) => {
        let result = await client.login(email, password);
        result = await client.request(readMe());
        let role = result.role;
        let user_id = result.id
        result = await client.request(readRole(role))
        role = result.name
        if(role == 'Junior manager') {
            result = await client.request(createItem('Documents_directus_users_1'), {
                Documents_id: document_id,
                directus_users_id: user_id
            })
            console.log(result)
            console.log(user_id)
            console.log(document_id)
        }
    }

    const updateDocument = async (document_id, signatore_id, checked) => {
        console.log(checked)
        let result = await client.login(email, password); 
        result = await client.request(readItems('Documents_directus_users'))
        let user_is_signatore = false;
        result.map(signatore => {
            if(signatore.directus_users_id == signatore_id && signatore.Documents_id == document_id) {
                user_is_signatore = true;
            }
        })
        if(!checked) {
            result = await client.request(readItems('Documents_directus_users'))
            result.map(async item => {
                if(item.Documents_id == document_id && item.directus_users_id == signatore_id) {
                    result = await client.request(deleteItem('Documents_directus_users', item.id));
                    return
                }
            })
        }

        if(!user_is_signatore && checked) {
            result = await client.request(createItem('Documents_directus_users', {
                Documents_id: document_id,
                directus_users_id: signatore_id
            }));
        }
    }

    useEffect(() => {
        getDocuments();
        getSignatories();
    }, []);
    
    if(!auth){
        return(
            <div></div>
        );
    }

    return(
        <div className='container'>
            <div className='Header'></div>
            {documents.map(document => {
                return(
                    <div key={document.Title}>
                        <h1>{document.Title}</h1>
                        <p>{document.Body}</p> 
                        <div>
                            <label htmlFor='signatures'>Подписанты</label>
                            {signatories.map(signatore => {
                                if(signatore.id == document.user_created || !checkSignatore(signatore.id, document.id)) {
                                    return
                                }
                                return(
                                    <div>
                                        <label htmlFor={signatore.id}>{signatore.first_name}</label>
                                        <input onChange={(event) => {updateDocument(document.id, signatore.id, event.target.checked)}} key={signatore.id} id={signatore.id} type='checkbox'></input>
                                    </div>
                                )
                            })}
                        </div>
                        <button onClick={() => {signDocument(document.id)}}>Подписать</button>
                    </div>
                )
            })}
        </div>
    );
}