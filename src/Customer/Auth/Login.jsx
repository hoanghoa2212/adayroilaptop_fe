import * as React from "react";
import {Grid, TextField, Button, Snackbar, Alert} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getUser, login} from "../../Redux/Auth/Action";
import {useEffect} from "react";
import {useState} from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginForm({handleNext}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const {auth} = useSelector((store) => store);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const handleCloseSnakbar = () => setOpenSnackBar(false);

    const recaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

    useEffect(() => {
        if (jwt) {
            dispatch(getUser(jwt))
        }
    }, [dispatch, jwt])

    useEffect(() => {
        if (auth.user || auth.error) {
            setOpenSnackBar(true);
        }
    }, [auth.user, auth.error]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!recaptchaToken) {
            alert("Vui lòng xác minh reCAPTCHA!");
            return;
        }
        const data = new FormData(event.currentTarget);

        const userData = {
            email: data.get("email"),
            password: data.get("password"),
            recaptchaToken: recaptchaToken,
        }
        console.log("login user", userData);

        dispatch(login(userData));
    };

    return (
        <React.Fragment className=" shadow-lg ">
            <form className="w-full" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="email"
                            name="email"
                            label="Email"
                            fullWidth
                            autoComplete="given-name"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="password"
                            name="password"
                            label="Password"
                            fullWidth
                            autoComplete="given-name"
                            type="password"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <ReCAPTCHA
                            sitekey={recaptchaSiteKey || "YOUR_FALLBACK_SITE_KEY"}
                            onChange={(token) => setRecaptchaToken(token)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            className="bg-[#9155FD] w-full"
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{padding: ".8rem 0"}}
                        >
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <div className="flex justify-center flex-col items-center">
                <div className="py-3 flex items-center">
                    <p className="m-0 p-0">Bạn không có tài khoản?</p>
                    <Button onClick={() => navigate("/signup")} className="ml-5" size="small">
                        Đăng ký
                    </Button>
                </div>
            </div>
            <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnakbar}>
                <Alert onClose={handleCloseSnakbar} severity={auth.error ? "error" : "success"} sx={{width: '100%'}}>
                    {auth.error
                        ? "Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại."
                        : (auth.user ? "Đăng nhập thành công !" : "")}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
}