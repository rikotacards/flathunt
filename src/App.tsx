import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Routes, Route } from "react-router-dom";
import { SearchPage } from "./pages/SearchPage";
import { Layout } from "./layout/Layout";
import { ListingsPage } from "./pages/ListingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ListingPage } from "./pages/ListingPage";
import { SavedListingsPage } from "./pages/SavedListingsPage";
import { FiltersProvider } from "./Providers/FilterProvider";
import { SearchResultPage } from "./pages/SearchResultPage";
import { SnackbarProvider } from "./Providers/SnackbarProvider";
import { RequestsPage } from "./pages/RequestsPage";
import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./Providers/AuthProvider";
import { AppBarProvider } from "./Providers/AppbarProvider";
import { SignUpPage } from "./pages/SignUpPage";
import { AgentSignUp } from "./components/AgentSignUp";
import { HelmetProvider } from 'react-helmet-async';

function App() {
  const queryClient = new QueryClient();
  const theme = createTheme({
    palette: {
      mode: "light",
      background: {
        // paper: "white",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          
          
        }
      }
    },
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <FiltersProvider>
            <AppBarProvider>
              <CssBaseline />

              <SnackbarProvider>
                <Layout>
                  <Routes>
                    <Route path="/" element={<SearchPage />} />
                    <Route path="/listings" element={<ListingsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/sign-up" element={<SignUpPage />} />
                    <Route
                      path="/listing/:listingId"
                      element={<ListingPage />}
                    />
                    <Route
                      path="/saved-listings"
                      element={<SavedListingsPage />}
                    />
                    <Route
                      path="/search-results"
                      element={<SearchResultPage />}
                    />
                    <Route path="/requests" element={<RequestsPage />} />

                  </Routes>
                </Layout>
              </SnackbarProvider>
            </AppBarProvider>
          </FiltersProvider>
        </AuthProvider>
      </QueryClientProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
