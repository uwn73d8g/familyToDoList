import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "./constants";


export default class AddTaskView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task: "",
            roomname: localStorage.getItem("roomname"),
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }
   
    componentWillMount() {
        let auth = window.localStorage.getItem('auth')
        if (auth === null ) {
            this.props.history.push({pathname: '/signin'})
        } else {

        }
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log(`https://localhost:443/tasks/${window.localStorage.getItem("roomname")}`);
        console.log(this.state);
        var body = { description: this.state.task };
        fetch(`https://localhost:443/tasks/${window.localStorage.getItem("roomname")}`, {
            method: "POST",
            headers: {
                "Authorization": window.localStorage.getItem("auth"),
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            mode: "cors",
            cache: "default",
        }).then(res => {
            if (!res.ok) {
                throw Error(res.statusText + " " + res.status);
            }
            return res.json();
        }).then(data => {
            console.log(data);
            this.props.history.push({pathname: "/main/" + this.state.roomname.toLowerCase()})
        }).catch(error => {
                alert(error)
                localStorage.clear()
                this.props.history.push({pathname: '/signin'})
            }
        );
    }


    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
                    <a className="navbar-brand" href="/main">To Do App</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            <a className="nav-item nav-link" href={"/main/" + this.state.roomname.toLowerCase()}>Home</a>
                            <a className="nav-item nav-link" href={"/admin/" + this.state.roomname.toLowerCase()}>UserBoard</a>
                        </div>
                    </div>
                    <button className="btn btn-warning my-2 my-sm-0 pull-right"
                        onClick={() => this.handleSignOut()}>
                        Sign Out
                    </button>
                </nav>
                <div className="d-flex justify-content-center pt-4 pb-5">
                    <div className="card w-50">
                        <div className="card-body">
                            <div className="container">
                                <div className="d-flex justify-content-center pt-4 pb-5">
                                    <h4>Add New Task</h4>
                                </div>
                                <form className="form-inline">
                                    <div className="form-group mx-sm-3 mb-2">
                                        <input className="form-control" placeholder="Add Task"
                                            onInput={evt => this.setState({ task: evt.target.value})} />
                                    </div>
                                    <button className="btn btn-warning mt-2 mb-2 ml-2" onClick={(evt) => this.handleSubmit(evt)}>Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}