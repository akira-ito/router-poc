
wget -O ./data/osrm/cayman_islands-latest.osm.pbf https://download.openstreetmap.fr/extracts/central-america/cayman_islands-latest.osm.pbf

# for MLD it partition then customize then routed
# for CH it contract then routed.

docker run --user "1001:1001" -t -v ./data/osrm:/data ghcr.io/project-osrm/osrm-backend osrm-extract -p /opt/car.lua /data/cayman_islands-latest.osm.pbf
docker run --user "1001:1001" -t -v ./data/osrm:/data ghcr.io/project-osrm/osrm-backend osrm-partition /data/cayman_islands-latest.osrm
docker run --user "1001:1001" -t -v ./data/osrm:/data ghcr.io/project-osrm/osrm-backend osrm-customize /data/cayman_islands-latest.osrm
docker run --user "1001:1001" -t -v ./data/osrm:/data ghcr.io/project-osrm/osrm-backend osrm-contract /data/cayman_islands-latest.osrm
