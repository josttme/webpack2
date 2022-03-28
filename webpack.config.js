const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dontenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	// Entry nos permite decir el punto de entrada de nuestra aplicación
	entry: './src/index.js',
	// Output nos permite decir hacia dónde va enviar lo que va a preparar webpacks
	output: {
		// path es donde estará la carpeta donde se guardará los archivos
		// Con path.resolve podemos decir dónde va estar la carpeta y la ubicación del mismo
		path: path.resolve(__dirname, 'dist'),
		// filename le pone el nombre al archivo final
		filename: '[name].[contenthash].js',

		assetModuleFilename: 'assets/images/[hash][ext]',
	},
	resolve: {
		// Aqui ponemos las extensiones que tendremos en nuestro proyecto para webpack los lea
		extensions: ['.js'],
		alias: {
			'@utils': path.resolve(__dirname, 'src/utils/'),
			'@templates': path.resolve(__dirname, 'src/templates/'),
			'@styles': path.resolve(__dirname, 'src/styles/'),
			'@images': path.resolve(__dirname, 'src/assets/images/'),
		},
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.s?css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: /\.png/,
				type: 'asset/resource',
			},
			{
				test: /\.(woff|woff2)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'assets/fonts/[hash][ext]',
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
		new Dontenv(),
		new CleanWebpackPlugin(),
	],
	optimization: {
		minimize: true,
		minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
	},
};
