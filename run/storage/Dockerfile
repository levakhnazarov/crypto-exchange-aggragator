#FROM mysql:5.7
#
##ADD data.sql /docker-entrypoint-initdb.d
#
##RUN chown -R mysql:root /var/lib/mysql/
#
##ARG MYSQL_DATABASE
##ARG MYSQL_USER
##ARG MYSQL_PASSWORD
##ARG MYSQL_ROOT_PASSWORD
##
##ENV MYSQL_DATABASE=$MYSQL_DATABASE
##ENV MYSQL_USER=$MYSQL_USER
##ENV MYSQL_PASSWORD=$MYSQL_PASSWORD
##ENV MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD
#
#ENV MYSQL_DATABASE=smartjex
#ENV MYSQL_USER=smartjex
##ENV MYSQL_PASSWORD=1
#ENV MYSQL_ROOT_PASSWORD=1
#
#ADD data.sql /etc/mysql/data.sql
#RUN sed -i 's/MYSQL_DATABASE/'$MYSQL_DATABASE'/g' /etc/mysql/data.sql
#RUN cp /etc/mysql/data.sql /docker-entrypoint-initdb.d
#
#EXPOSE 3306
FROM mysql:5.7.15

MAINTAINER me

ENV MYSQL_DATABASE=smartjex \
    MYSQL_ROOT_PASSWORD=1

ADD data.sql /docker-entrypoint-initdb.d

EXPOSE 3306