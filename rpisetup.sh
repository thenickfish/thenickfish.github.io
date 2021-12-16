apt-get update -y
apt-get upgrade -y
apt-get install unattended-upgrades -y

# keyboard
locale=en_US.UTF-8
layout=us
sudo raspi-config nonint do_change_locale $locale
sudo raspi-config nonint do_configure_keyboard $layout

sudo ln -fs /usr/share/zoneinfo/America/Denver /etc/localtime
dpkg-reconfigure -f noninteractive tzdata

# curl -sSL https://install.pi-hole.net | bash

# https://dl.ui.com/unifi/5.11.46/unifi_sysvinit_all.deb

m3VoLMYy