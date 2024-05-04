import React, { useState } from "react";
import Image from "next/image";
import {
  Box,
  TextField,
  Typography,
  Slider,
  Container,
  Button,
  CircularProgress,
  Paper, // Import Paper component
} from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import Logo from "../assets/upword.svg";

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
      <Paper elevation={3} sx={{ width: "100%", padding: 3, bgcolor: "white" }}>
        {" "}
        {/* Paper with elevation and white background */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{ position: "relative", height: 300, width: "100%", mb: -5 }}
          >
            <Image
              src={Logo}
              alt="UpWord Logo"
              layout="fill"
              objectFit="contain"
              style={{ position: "absolute" }}
            />
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
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={handleReset}
              disabled={loading}
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
            InputProps={{ readOnly: true }}
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
      </Paper>
    </Container>
  );
};

export default Index;
