import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Slider,
  Container,
  Button,
  CircularProgress,
} from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";

const Index: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [scale, setScale] = useState<number>(5);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleScaleChange = (_event: Event, newValue: number | number[]) => {
    setScale(newValue as number);
  };

  const handleReset = () => {
    setText("");
    setScale(5);
    setResult("");
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/generate", {
        text: text,
        scale: scale,
      });
      setResult(response.data.response);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
        sx={{ mt: 4 }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h3" component="h1" gutterBottom>
            UpWord
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            A text rephrasing app based on formality scale
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="Enter your text"
          variant="outlined"
          value={text}
          onChange={handleTextChange}
          multiline
          rows={4}
        />
        <Typography id="input-slider" gutterBottom>
          Formality Scale: {scale}
        </Typography>
        <Slider
          aria-labelledby="input-slider"
          value={scale}
          onChange={handleScaleChange}
          step={1}
          marks
          min={1}
          max={10}
          valueLabelDisplay="auto"
        />

        <Box display={"flex"} gap={3}>
          <Button
            variant="outlined"
            color="primary" // Use a different color for contrast
            startIcon={<RefreshIcon />} // Icon indicating a reset action
            onClick={handleReset}
            disabled={loading} // Disable during loading if needed
          >
            Reset
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={
              loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <AutoFixHighIcon />
              )
            }
            onClick={handleGenerate}
            disabled={loading}
          >
            Generate
          </Button>
        </Box>

        <TextField
          fullWidth
          label="Result"
          variant="outlined"
          value={result}
          InputProps={{
            readOnly: true,
          }}
          multiline
          minRows={4}
          disabled
        />
        {result && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileCopyIcon />}
            onClick={handleCopyToClipboard}
          >
            Copy
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default Index;
