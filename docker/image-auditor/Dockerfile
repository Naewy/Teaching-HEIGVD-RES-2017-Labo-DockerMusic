FROM node:4.3.1
MAINTAINER Lara Chauffoureaux <lara.chauffoureaux@heig-vd.ch>

#
# When we build the image, we copy the executable jar in the image file system. 
#
COPY src /opt/app/

WORKDIR /opt/app/

ENTRYPOINT ["node", "/opt/app/auditor.js"]
