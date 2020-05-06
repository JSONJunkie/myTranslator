import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import ButtonLink from "../components/ButtonLink";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1
  },
  alert: {
    position: "absolute",
    top: theme.spacing(1),
    left: theme.spacing(0),
    right: theme.spacing(0)
  },
  outterButton: {
    padding: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1, 0, 1)
  },
  paper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  loader: {
    marginTop: theme.spacing(20)
  }
}));

const Index = () => {
  const router = useRouter();
  const classes = useStyles();
  const defaultValues = {
    input: ""
  };

  const { register, handleSubmit, errors, setValue, watch } = useForm({
    defaultValues
  });

  const selectValue = watch("input");

  const [helperText, setHelperText] = useState({
    inputError: "",
    isInputError: false
  });

  const handleSub = e => {
    e.preventDefault();
    router.push("/enes/[translation]", "/enes/" + selectValue.toLowerCase());
  };

  const handleClear = e => {
    e.preventDefault();
    setValue("input", "");
  };

  const onChange = e => {
    setValue("input", e.target.value);
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
    <div className={classes.root}>
      <Container className={classes.content}>
        <Paper className={classes.paper}>
          <form onSubmit={handleSubmit(handleSub)}>
            <Grid container spacing={2}>
              <Grid item xs>
                <TextField
                  aria-label="untranslated text"
                  name="input"
                  value={selectValue}
                  variant="filled"
                  placeholder="Enter text to be translated here..."
                  fullWidth
                  multiline
                  rows={5}
                  autoFocus
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
                <Grid container>
                  <Grid item xs={6} className={classes.outterButton}>
                    <ButtonLink
                      href={"/enes/[translation]"}
                      as={"/enes/" + selectValue.toLowerCase()}
                      fullWidth
                      color="primary"
                      variant="contained"
                      className={classes.button}
                    >
                      Translate
                    </ButtonLink>
                  </Grid>
                  <Grid item xs={6} className={classes.outterButton}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      onClick={e => handleClear(e)}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default connect(null)(Index);
