import React, { Component } from 'react'
import './Auth.css';
import AuthContext from '../../context/auth-context';


class AuthPage extends Component {
    constructor(props) {
        super(props);
        this.nameEl = React.createRef();
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }
    state = {
        isLogin: true
    }
    static contextType = AuthContext;

    switchModeHandler = () => {
        this.setState({ isLogin: !this.state.isLogin });
    }
    submitHandler = event => {
        event.preventDefault();
        let name = 'a';
        if (!this.state.isLogin) {
            name = this.nameEl.current.value;
        }

        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if (name.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0) {
            return;
        }
        let user = {
            query: `
            query{
                login(email:"${email}",password:"${password}"){
                    userId
                    token
                    tokenExpiration
                }
            }
            `
        }
        if (!this.state.isLogin) {
            user = {
                query: `
            mutation{
                createUser(userInput:{name:"${name}",email:"${email}",password:"${password}"}){
                    _id
                    email
                }
            }
            `
            };
        }
        //Send a request to the backend
        fetch('http://localhost:5000/graphql', {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                'Content-Type': "application/json"
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                if (resData.data.login.token) {
                    this.context.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration)
                }
            })
            .catch(err => { console.log(err) })
    }
    render() {
        let loggedin = this.state.isLogin;
        return (
            <form className="auth-form" onSubmit={this.submitHandler}>

                {!loggedin ? <div className="form-control">
                    <label htmlFor="name">Name: </label>
                    <input type="name" id="name" ref={this.nameEl}></input>
                </div> : ''}
                <div className="form-control">
                    <label htmlFor="email">Email: </label>
                    <input type="email" id="email" ref={this.emailEl}></input>
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password: </label>
                    <input type="password" id="password" ref={this.passwordEl}></input>
                </div>
                <div className="form-actions">
                    <button type="button" onClick={this.switchModeHandler}>
                        Switch to {this.state.isLogin ? 'SignUp' : "Login"}
                    </button>
                    <button type="submit">{this.state.isLogin ? 'Login' : "Signup"}</button>
                </div>
            </form>
        )
    }
}
export default AuthPage;