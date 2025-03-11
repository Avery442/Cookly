# Cookly Website

Cookly is an open source webserver that you can host in cooperation with Ollama to create recipes using AI. This project was made using Node JS, HTML, CSS and Regular Javascript. 
Nothing is really special about this page and web design was cooperated with AI to help create colour palletes.

## Disclaimer

When hosting, using or communicating with this app in anyway, I accept ZERO responability to what happens, including but not limited to:
  - Death,
  - Injury,
  - Generic Illness related to food.

## Hosting a self-hosted instance

To host an instance you require:
  - Node JS,
  - Ollama,
    - Llama 3.2 from Ollama. 
  - A browser that is modern enough to render CSS and HTML.

Firstly, install the requirements if not done already.
Secondly, clone the repository via

```
git clone https://github.com/Avery442/Cookly.git
```

Then, install all the dependancies

```
npm i
```

Finally, execute the app

```
node index.js
```

## For self-hosting people

Ensure you forward the port 8002 on your home router to allow external use. A domain is recommended.

## Cloudflare

You can link a domain to this IP using CloudFlare's proxy service. It is supported and works correctly.

## Security

There are no social abilities or account creation processes. Use your common sense.
This app is running on HTTP. You can modify the code and make it use HTTPS if you want, if you do feel free to make a pull request! 


## Final Notice

Have fun and experiment with the app. I came up with the app's idea just by being on a train with my mother! She said I wonder if you could make an online cookbook. So I created this app where AI does the hard work for you. After all, thats what its there for right?
