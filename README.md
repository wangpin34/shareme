# shareme
It's a file-sharing tool that makes sharing easier.

[![NPM](https://nodei.co/npm/shareme.png?stars&downloads)](https://nodei.co/npm/shareme/)

## Install

It should be installed globally so that it can be used from anywhere.

```
npm install -g shareme
```
## Usage

* Add file to sharing list
```
shareme add myfile.txt
```

* Remove file from sharing list
```
shareme delete myfile.txt
```
* List shared files
```
shareme list
```
* Start sharing. So anyone could see those shared file from browser. 

```
shareme start
```
By default, the shareme server be deployed on local port 4000. And you can change it as you like

```
shareme start -p 1000
```
Then it works on localhost:1000 in your browser. Enjoy.


## LICENSE
***MIT***
