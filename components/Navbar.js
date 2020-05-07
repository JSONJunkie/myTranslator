import { fade, makeStyles } from "@material-ui/core/styles";
import { Fragment } from "react";
import InputBase from "@material-ui/core/InputBase";
import TextField from "@material-ui/core/TextField";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import TranslateIcon from "@material-ui/icons/Translate";

import ButtonLink from "./ButtonLink";

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
                <div className={classes.search}>
                  <TextField
                    className={classes.input}
                    autoFocus
                    fullWidth
                    size="small"
                  />
                  <ButtonLink
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    Translate
                  </ButtonLink>
                </div>
              </Grid>
            </Grid>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar className={classes.hidden}>
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
                <TextField
                  className={classes.input}
                  autoFocus
                  fullWidth
                  size="small"
                  inputProps={{ "aria-label": "translate" }}
                  name="input"
                  value={selectValue}
                  placeholder="Translate something..."
                  helperText={helperText.inputError}
                  error={helperText.isInputError}
                  inputRef={register({
                    required: {
                      value: true,
                      message: "Please include some text to translate"
                    },
                    pattern: {
                      value: /\b[^\d\W]+\b/,
                      message: "Please only include words"
                    }
                  })}
                  onChange={e => onChange(e)}
                />
                <ButtonLink
                  className={classes.button}
                  href={"/enes/[translation]"}
                  as={"/enes/" + selectValue.toLowerCase()}
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  Translate
                </ButtonLink>
              </div>
            </form>
          </Grid>
        </Grid>
      </Toolbar>
    </Fragment>
  );
};

// Navbar.propTypes = {
//   rollbar: PropTypes.object.isRequired
// };

export default Navbar;
