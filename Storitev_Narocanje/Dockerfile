# Use official PHP image with Apache
FROM php:8.3-apache

# Install necessary PHP extensions
RUN apt-get update && apt-get install -y libpq-dev libzip-dev zlib1g-dev && \
    docker-php-ext-install pdo_mysql zip && \
    pecl install redis && \
    docker-php-ext-enable redis


# Copy application files to Apache's web directory
COPY . /var/www/html/

RUN a2enmod rewrite

# Install Composer (for managing PHP dependencies)
RUN curl -sS https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer

# Install the required dependencies via Composer
RUN cd /var/www/html && composer install

# Expose port 80 for the PHP application
EXPOSE 80

# Start the Apache server when the container runs
CMD service apache2 start && php /var/www/html/REDIS.php