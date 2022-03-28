const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[contenthash].js',
		assetModuleFilename: 'assets/images/[hash][ext][query]',
	},
	resolve: {
		extensions: ['.js'],
		alias: {
			'@utils': path.resolve(__dirname, 'src/utils'),
			'@templates': path.resolve(__dirname, 'src/templates'),
			'@styles': path.resolve(__dirname, 'src/styles'),
			'@images': path.resolve(__dirname, 'src/assets/images'),
		},
	},
	module: {
		rules: [
			{
				// Test declara que extensión de archivos aplicara el loader
				test: /\.m?js$/,
				// Use es un arreglo u objeto donde dices que loader aplicaras
				use: {
					loader: 'babel-loader',
				},
				exclude: /node_modules/,
				// Exclude permite omitir archivos o carpetas especificas
			},
			{
				test: /\.s?css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: /\.png/,
				type: 'asset/resource',
			},
			{
				test: /\.(woff|woff2)$/i, // Tipos de fuentes a incluir
				type: 'asset/resource', // Tipo de módulo a usar (este mismo puede ser usado para archivos de imágenes)
				generator: {
					filename: 'assets/fonts/[hash][ext][query]', // Directorio de salida
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: './public/index.html',
			filename: './index.html',
		}),
		new MiniCssExtractPlugin({
			filename: 'assets/[name].[contenthash].css',
		}),

		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'src', 'assets/images'),
					to: 'assets/images',
				},
			],
		}),
		new Dotenv(),
		new CleanWebpackPlugin(),
	],
	optimization: {
		minimize: true,
		minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
	},
};
