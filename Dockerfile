# [IMPORTANT] Must be built from the root of the project for the COPY/paths to work

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

# CORS rules are needed so people can easily reuse logo and fonts from their website
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY apps/docs/dist/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
