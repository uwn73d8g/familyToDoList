import React from "react";

export default class MemberView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            done: "",
            data: null,
            href: "/main"
        };
    }
    componentDidMount() {
        let auth = window.localStorage.getItem("auth");
        if (auth === null) {
            this.props.history.push({ pathname: "/signin" });
        } else {
            let room = localStorage.getItem("roomname");
            this.setState({ href: "/main/" + room.toLowerCase() });
        }
    }

    componentWillMount() {
        fetch(`https://api.kangwoo.tech/tasks/${window.localStorage.getItem("roomname")}`, {
            method: "GET",
            headers: {
                "Authorization": window.localStorage.getItem("auth")
            }
        }).then(res => {
                if (!res.ok) {
                    throw Error(res.statusText + " " + res.status);
                }
                return res.json();
            })
            .then(data => {
                console.log(data);
                let user = data.map(info => {
                    console.log(info);
                    let num = "" + info.userID;
                    console.log(localStorage.getItem("userid") == num);
                    // check condition
                    if (localStorage.getItem("userid") == num) {
                        console.log("im here");
                        //render
                        return (
                            <div className="row">
                                <div className="username col-md-4">
                                    <div className="container p-2">
                                        <div className="border">
                                            <p className="p-2">
                                                {info.description}
                                                <button
                                                    className="btn btn-warning pull-right"
                                                    onClick={() =>
                                                        this.handleDone(
                                                            info._id
                                                        )
                                                    }
                                                >
                                                    Finished
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                });
                this.setState({ data: user });
            })
            .catch(error => {
                alert(error);
            });
    }
    handleDone(id) {

        fetch(`https://api.kangwoo.tech/tasks/done/${id}`, {
            method: "POST",
            headers: {
                Authorization: localStorage.getItem("auth"),
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw Error(res.statusText + " " + res.status);
                }
            })
            .then(() => {
                //re-render
                window.location.reload();
            })
            .catch(function(error) {
                alert();
            });
    }
    handleSignOut() {
        fetch("https://api.kangwoo.tech/sessions/mine", {
            method: "DELETE",
            headers: {
                Authorization: localStorage.getItem("auth")
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw Error(res.statusText + " " + res.status);
                }
                localStorage.clear();
                this.props.history.push({ pathname: "/signin" });
            })
            .catch(function(error) {
                localStorage.clear();
            });
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
                    <a className="navbar-brand" href="#">
                        To Do App
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarNavAltMarkup"
                        aria-controls="navbarNavAltMarkup"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div
                        className="collapse navbar-collapse"
                        id="navbarNavAltMarkup"
                    >
                        <div className="navbar-nav">
                            <a
                                className="nav-item nav-link"
                                href={this.state.href}
                            >
                                Home
                            </a>
                            <a className="nav-item nav-link active" href="#">
                                UserBoard{" "}
                                <span className="sr-only">(current)</span>
                            </a>
                        </div>
                    </div>
                    <button
                        className="btn btn-warning my-2 my-sm-0 pull-right"
                        onClick={() => this.handleSignOut()}
                    >
                        Sign Out
                    </button>
                </nav>
                <div>
                    <h3 className="p-3">Current Task List</h3>

                </div>
                {this.state.data}
            </div>
        );
    }
}
