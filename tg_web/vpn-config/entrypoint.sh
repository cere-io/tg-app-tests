#!/bin/sh
echo "$VPN_USER" > /vpn/auth.txt
echo "$VPN_PASS" >> /vpn/auth.txt
chmod 600 /vpn/auth.txt
exec openvpn $OPENVPN_OPTS
