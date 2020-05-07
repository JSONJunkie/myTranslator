import { fade, makeStyles } from "@material-ui/core/styles";
import { Fragment, useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import TranslateIcon from "@material-ui/icons/Translate";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  hidden: {
    visibility: "hidden"
  },
  spacing: {
    marginLeft: theme.spacing(0),
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(2)
    }
  },
  input: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(13),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    [theme.breakpoints.up("md")]: {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5)
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 1),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.85)
    },
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    }
  },
  button: {
    position: "absolute",
    right: theme.spacing(0.5),
    top: theme.spacing(0.5)
  },
  titleDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  titleMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  }
}));

const Navbar = () => {
  const classes = useStyles();

  const router = useRouter();

  const [routing, setRouting] = useState({
    url: "",
    starting: false,
    complete: true
  });

  const handleRouteChangeStart = url => {
    setRouting(prev => ({ ...prev, starting: true, url }));
  };

  const handleRouteChangeComplete = url => {
    setRouting(prev => ({ ...prev, complete: true }));
  };

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChangeComplete);
    router.events.on("routeChangeComplete", handleRouteChangeStart);
    return () => {
      router.events.on("routeChangeStart", handleRouteChangeComplete);
      router.events.off("routeChangeComplete", handleRouteChangeStart);
    };
  }, []);

  useEffect(() => {
    if (routing.complete) {
      setRouting(prev => ({ ...prev, complete: false }));
      reset({ TextField: "" });
    }
    if (routing.starting) {
      setRouting(prev => ({ ...prev, starting: false, url: "" }));
      if (routing.url === "enes/translate") {
        reset({ TextField: "translate" });
      }
    }
  }, [routing.starting, routing.complete]);

  const { handleSubmit, errors, control, reset } = useForm();

  const [helperText, setHelperText] = useState({
    inputError: "",
    isInputError: false
  });

  const handleSub = e => {
    if (e.input === "") {
      router.push("/enes/[translation]", "/enes/translate");
    } else {
      router.push("/enes/[translation]", "/enes/" + e.input.toLowerCase());
    }
  };

  const onChange = e => {
    return e.target.value;
  };

  useEffect(() => {
    if (errors.input) {
      setHelperText(prev => ({
        inputError: errors.input.message,
        isInputError: true
      }));
    } else {
      setHelperText(prev => ({ inputError: "", isInputError: false }));
    }
  }, [errors.input]);

  return (
    <Fragment>
      <AppBar position="fixed">
        <Container maxWidth="lg" disableGutters={true}>
          <Toolbar>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Grid container className={classes.titleDesktop}>
                  <Typography variant="h4">Translator</Typography>
                </Grid>
                <Grid container className={classes.titleMobile}>
                  <TranslateIcon fontSize="large" />
                </Grid>
              </Grid>
              <Grid item xs className={classes.spacing}>
                <form onSubmit={handleSubmit(handleSub)}>
                  <div className={classes.search}>
                    <Controller
                      as={TextField}
                      name="input"
                      control={control}
                      className={classes.input}
                      autoFocus
                      fullWidth
                      id="translate"
                      size="small"
                      placeholder="Translate something..."
                      helperText={helperText.inputError}
                      error={helperText.isInputError}
                      onChange={([e]) => onChange(e)}
                      defaultValue=""
                      rules={{
                        pattern: {
                          value: /\b[^\d\W]+\b/,
                          message: "Alphabets only"
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      className={classes.button}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      Translate
                    </Button>
                  </div>
                </form>
              </Grid>
            </Grid>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar className={classes.hidden}></Toolbar>
    </Fragment>
  );
};

// Navbar.propTypes = {
//   rollbar: PropTypes.object.isRequired
// };

export default Navbar;
