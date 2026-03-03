const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');
const path = require('path');

module.exports = {
  entry: './src/index',
  mode: 'development',
  target: 'web',
  devServer: {
    port: 3004,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  },
  output: {
    publicPath: 'auto',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react', '@babel/preset-typescript'],
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'dashboardMFE',
      filename: 'remoteEntry.js',
      exposes: {
        './Dashboard': './src/components/Dashboard.tsx',
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: '^18.3.1' },
        "react-dom": { singleton: true, eager: true, requiredVersion: '^18.3.1' },
        "react-router-dom": { singleton: true, eager: true, requiredVersion: '^6.26.0' }
      }
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
