import re

# Markdown table data
product_list = """
| Type | Category | Brand | Model | Est. Price |
|---|---|---|---|---|
| CAR | HEAD_UNIT | Pioneer | DMH-WT8600NEX | $1,200 |
| CAR | HEAD_UNIT | Sony | XAV-9500ES | $998 |
| CAR | HEAD_UNIT | Kenwood | Excelon DMX908S | $849 |
| CAR | HEAD_UNIT | Alpine | iLX-F511 Halo11 | $1,099 |
| CAR | HEAD_UNIT | JVC | KW-Z1000W | $899 |
| CAR | HEAD_UNIT | Stinger | HEIGH10 | $1,100 |
| CAR | AMPLIFIER | AudioControl | D-6.1200 | $899 |
| CAR | AMPLIFIER | Sony Mobile | XM-8ES | $799 |
| CAR | AMPLIFIER | JL Audio | HD1200/1 | $1,350 |
| CAR | AMPLIFIER | Ground Zero | GZCA 3.0K-SPL | $750 |
| CAR | AMPLIFIER | Zapco | Z-150.6 AP | $1,250 |
| CAR | AMPLIFIER | Hifonics | Brutus Elite BE35 | $450 |
| CAR | SUBWOOFER | JL Audio | 12W7AE-3 | $1,100 |
| CAR | SUBWOOFER | Kicker | Solo-Baric L7X 12" | $899 |
| CAR | SUBWOOFER | Rockford Fosgate | Power T1D212 | $549 |
| CAR | SUBWOOFER | Skar Audio | ZVX-15v2 | $380 |
| CAR | SUBWOOFER | Sundown Audio | Nightshade v.6 | $950 |
| CAR | SUBWOOFER | Audison | Prima APBX 10 DS | $350 |
| CAR | SPEAKERS | Focal | ES 165 K | $650 |
| CAR | SPEAKERS | Morel | Virtus Nano Carbon | $699 |
| CAR | SPEAKERS | Hertz | Mille Pro MPK 165P | $430 |
| CAR | SPEAKERS | Infinity | Kappa 60csx | $240 |
| CAR | SPEAKERS | Alpine | R2-S652 | $299 |
| CAR | SPEAKERS | Audison | Prima APK 165 | $280 |
| CAR | SECURITY | Viper | 5706V LCD 2-Way | $350 |
| CAR | SECURITY | IGLA | Anti-Theft Digital PIN | $650 |
| CAR | SECURITY | Pandora | Elite v2 | $1,100 |
| CAR | SECURITY | Compustar | CS7900-AS | $250 |
| CAR | SECURITY | LoJack | SVR System | $800 |
| CAR | REMOTE_START | DroneMobile | X1-MAX LTE | $199 |
| CAR | REMOTE_START | Compustar | PRO T13 | $550 |
| CAR | REMOTE_START | Viper | DS4+ | $300 |
| CAR | REMOTE_START | Fortin | EVO-ONE | $150 |
| CAR | REMOTE_START | MPC | Factory Add-on | $180 |
| CAR | LIGHTING | Morimoto | XB LED Headlights | $1,400 |
| CAR | LIGHTING | Lasfit | LS Plus Series | $130 |
| CAR | LIGHTING | Govee | DreamView Underglow | $70 |
| CAR | LIGHTING | Type S | Smart Hub Kit | $110 |
| CAR | LIGHTING | Philips | Ultinon Pro9000 | $160 |
| CAR | CUSTOM | Helix | DSP Ultra | $1,200 |
| CAR | CUSTOM | Mosconi | Gladen DSP 8to12 | $1,100 |
| CAR | CUSTOM | AudioControl | LC7i Black | $230 |
| CAR | CUSTOM | BlackVue | DR970X Dashcam | $470 |
| CAR | CUSTOM | Escort | MAX 360c MKII | $650 |
| CAR | CUSTOM | Uniden | R8 Radar Detector | $700 |
| CAR | CUSTOM | Garmin | Dash Cam Live | $400 |
| CAR | CUSTOM | WeBoost | Drive Reach Booster | $500 |
| CAR | CUSTOM | Victron | Orion-Tr Smart DC-DC | $250 |
| CAR | CUSTOM | NOCO | GB70 Jump Starter | $210 |
| CAR | CUSTOM | Scosche | MagSafe Car Mount | $50 |
| MARINE | HEAD_UNIT | Fusion | MS-RA770 Apollo | $700 |
| MARINE | HEAD_UNIT | JL Audio | MediaMaster 105 | $730 |
| MARINE | HEAD_UNIT | Wet Sounds | WS-MC-2 | $450 |
| MARINE | HEAD_UNIT | Rockford Fosgate | PMX-8DH | $700 |
| MARINE | HEAD_UNIT | Clarion | CMM-30 | $450 |
| MARINE | HEAD_UNIT | Garmin | Quatix 7 Watch | $699 |
| MARINE | AMPLIFIER | JL Audio | M800/8-v2 | $950 |
| MARINE | AMPLIFIER | Fusion | Apollo AP82400 | $850 |
| MARINE | AMPLIFIER | Wet Sounds | Sinister SDX6 | $1,100 |
| MARINE | AMPLIFIER | Rockford Fosgate | M5-1500X5 | $850 |
| MARINE | AMPLIFIER | Alpine | S-A60M Marine | $350 |
| MARINE | AMPLIFIER | Rockville | RXM-T1 | $120 |
| MARINE | SUBWOOFER | JL Audio | M6-10W | $480 |
| MARINE | SUBWOOFER | Wet Sounds | REVO 12 HP | $550 |
| MARINE | SUBWOOFER | Rockford Fosgate | M2D4-12 | $450 |
| MARINE | SUBWOOFER | Fusion | Signature Series 3 | $400 |
| MARINE | SUBWOOFER | Kicker | KM12 12" | $280 |
| MARINE | SUBWOOFER | DS18 | PSW10.4D Shallow | $160 |
| MARINE | SPEAKERS | Wet Sounds | REVO 6-X | $350 |
| MARINE | SPEAKERS | JL Audio | M6-650X | $450 |
| MARINE | SPEAKERS | Rockford Fosgate | M2-65 | $350 |
| MARINE | SPEAKERS | Kicker | KM8 8" | $260 |
| MARINE | SPEAKERS | Polk Audio | DB652 | $110 |
| MARINE | SPEAKERS | Alpine | SPS-M601 | $149 |
| MARINE | TOWER_SPK | Wet Sounds | REV 10 | $1,250 |
| MARINE | TOWER_SPK | JL Audio | M6-880ETX | $1,400 |
| MARINE | TOWER_SPK | Rockford Fosgate | M2WL-8HB | $950 |
| MARINE | TOWER_SPK | JBL | Tower X MT10HLW | $800 |
| MARINE | TOWER_SPK | DS18 | NXL-X8TP | $450 |
| MARINE | LIGHTING | Lumishore | EOS TIX402 | $1,200 |
| MARINE | LIGHTING | Shadow-Caster | SCR-24 | $650 |
| MARINE | LIGHTING | OceanLED | Explore E6 | $900 |
| MARINE | LIGHTING | Rigid | Marine SR-Series | $300 |
| MARINE | LIGHTING | JL Audio | MLC-RW Controller | $350 |
| MARINE | SECURITY | GOST | Apparition SM | $2,500 |
| MARINE | SECURITY | Siren Marine | Siren 3 Pro | $750 |
| MARINE | SECURITY | YachtWatch | Wireless Alarm | $1,200 |
| MARINE | SECURITY | KVH | Watch Monitoring | $990 |
| MARINE | SECURITY | Raymarine | CAM210 IP Camera | $700 |
| MARINE | CUSTOM | Garmin | GPSMAP 8612xsv | $4,000 |
| MARINE | CUSTOM | Simrad | NSX 12 | $3,200 |
| MARINE | CUSTOM | Lowrance | HDS PRO 12 | $3,500 |
| MARINE | CUSTOM | Raymarine | Axiom 2 Pro 12 | $3,800 |
| MARINE | CUSTOM | Furuno | TZTouch3 12" | $2,700 |
| MARINE | CUSTOM | CZone | Digital Switching | $1,500 |
| MARINE | CUSTOM | Starlink | Maritime Kit | $2,500 |
| MARINE | CUSTOM | Icom | M510 VHF | $650 |
| MARINE | CUSTOM | FLIR | M232 Thermal Cam | $3,500 |
| MARINE | CUSTOM | Minn Kota | Terrova Trolling | $2,200 |
| MARINE | CUSTOM | Power-Pole | Blade 10' | $2,100 |
| TRUCK | REMOTE_START | Compustar | CSX4905-S-KIT | $600 |
| TRUCK | REMOTE_START | 12Volt Solutions | Plug & Play Kit | $350 |
| TRUCK | REMOTE_START | Start-X | Vehicle Specific | $200 |
| TRUCK | REMOTE_START | MyKeyPremium | Smart Key System | $400 |
| TRUCK | REMOTE_START | Directed | Python 413 | $150 |
| TRUCK | REMOTE_START | IDataStart | HC3.5 | $450 |
| TRUCK | SECURITY | Viper | 5906V Color LCD | $550 |
| TRUCK | SECURITY | Tazer | RAM/Jeep Programmer | $250 |
| TRUCK | SECURITY | Revelco | Anti-Theft Plug | $500 |
| TRUCK | SECURITY | Compustar | DAS-II Shock Sensor | $100 |
| TRUCK | SECURITY | Brandmotion | FullVUE Mirror | $550 |
| TRUCK | SECURITY | Carlock | 4G GPS Tracker | $60 |
| TRUCK | LIGHTING | Rigid Industries | Adapt E-Series 50" | $1,850 |
| TRUCK | LIGHTING | Baja Designs | OnX6+ 50" | $1,650 |
| TRUCK | LIGHTING | KC HiLiTES | Gravity LED Pro6 | $1,100 |
| TRUCK | LIGHTING | Morimoto | XB LED Fog Lights | $250 |
| TRUCK | LIGHTING | Putco | Blade Tailgate Bar | $200 |
| TRUCK | LIGHTING | RECON | OLED Tail Lights | $850 |
| TRUCK | LIGHTING | Oracle | Flush LED Tail Lights | $450 |
| TRUCK | LIGHTING | Quake LED | RGB Rock Lights | $250 |
| TRUCK | LIGHTING | Diode Dynamics | SS3 LED Pods | $280 |
| TRUCK | LIGHTING | Rough Country | 50" Curved Light Bar | $300 |
| TRUCK | AMPLIFIER | Memphis | MXA750.6 IP66 | $620 |
| TRUCK | AMPLIFIER | JL Audio | MX500/1 | $430 |
| TRUCK | AMPLIFIER | Kicker | PXA300.4 | $350 |
| TRUCK | AMPLIFIER | Rockford Fosgate | TM400X4ad | $550 |
| TRUCK | AMPLIFIER | Stinger | MT-2000.1 | $229 |
| TRUCK | AMPLIFIER | Skar Audio | RP-1200.1D | $170 |
| TRUCK | SUBWOOFER | AudioControl | Under Seat Dual 10" | $1,199 |
| TRUCK | SUBWOOFER | JL Audio | Stealthbox (Vehicle) | $900 |
| TRUCK | SUBWOOFER | Rockford Fosgate | P3S Shallow 12" | $230 |
| TRUCK | SUBWOOFER | MTX | Thunderform Box | $600 |
| TRUCK | SUBWOOFER | Alpine | SWT-10S2 Shallow | $180 |
| TRUCK | SUBWOOFER | NVX | QB12SPA Loaded | $387 |
| TRUCK | HEAD_UNIT | Alpine | iLX-F509 Halo9 | $999 |
| TRUCK | HEAD_UNIT | Linkswell | T-Style Gen 5 | $1,200 |
| TRUCK | HEAD_UNIT | Kenwood | DNR1008RVS | $1,399 |
| TRUCK | HEAD_UNIT | Sony | XAV-AX6000 | $600 |
| TRUCK | HEAD_UNIT | Pioneer | DMH-2660NEX | $450 |
| TRUCK | CUSTOM | Garmin | Overlander GPS | $700 |
| TRUCK | CUSTOM | Magellan | TRX7 CS Off-Road | $550 |
| TRUCK | CUSTOM | sPOD | BantamX System | $850 |
| TRUCK | CUSTOM | Garmin | PowerSwitch | $500 |
| TRUCK | CUSTOM | Switch-Pros | SP-9100 | $600 |
| TRUCK | CUSTOM | Warn | HUB Wireless Winch | $130 |
| TRUCK | CUSTOM | ARB | Twin Compressor | $600 |
| TRUCK | CUSTOM | Midland | MXT575 GMRS | $400 |
| TRUCK | CUSTOM | Rugged Radios | GMR2 Handheld | $150 |
| TRUCK | CUSTOM | EchoMaster | IntelliHaul Camera | $750 |
| TRUCK | CUSTOM | Redarc | Tow-Pro Elite | $230 |
| TRUCK | CUSTOM | Tekonsha | P3 Brake Controller | $160 |
| TRUCK | CUSTOM | Viair | 450C Compressor | $250 |
| TRUCK | CUSTOM | Superchips | Flashpaq F5 | $400 |
"""

image_mapping = {
    "Pioneer DMH-WT8600NEX": "https://images.pioneerelectronics.com/PUSA/Images/Product%20Images/Car/DMH-WT8600NEX_Main.png",
    "Sony XAV-9500ES": "https://images.sony.com/is/image/SonyTrans/XAV-9500ES_Primary",
    "Kenwood Excelon DMX908S": "https://www.kenwood.com/usa/car/excelon/dmx908s/images/dmx908s_01.jpg",
    "Alpine iLX-F511 Halo11": "https://alpine-usa.com/data/product/783/iLX-F511_Front.jpg",
    "JL Audio 12W7AE-3": "https://images.crutchfieldonline.com/products/2012/136/xlarge/13612W7AE-F.jpg",
    "Focal ES 165 K": "https://www.focal.com/sites/www.focal.com/files/imagecache/product_image_large/focal_es_165_k_kit.jpg",
    "Viper 5706V LCD 2-Way": "https://www.viper.com/images/products/5706V.png",
    "Compustar PRO T13": "https://www.compustar.com/wp-content/uploads/2021/03/T13-Front.png",
    "Rockford Fosgate Power T1D212": "https://rockfordfosgate.com/products/images/T1D212_1_l.jpg",
    "Kicker Solo-Baric L7X 12\"": "https://www.kicker.com/app/products/solobaric_l7x/images/L7X12_Front.png",
    "Fusion MS-RA770 Apollo": "https://www.fusionentertainment.com/assets/images/products/MS-RA770/MS-RA770_Front.png",
    "Garmin GPSMAP 8612xsv": "https://static.garmincdn.com/en/products/010-02092-03/g/rf-8612xsv-01.jpg",
    "Rigid Industries Adapt E-Series 50\"": "https://www.rigidindustries.com/media/catalog/product/6/5/65251_1.jpg",
    "Garmin Overlander GPS": "https://static.garmincdn.com/en/products/010-02195-00/g/rf-overlander-01.jpg",
}

category_defaults = {
    "CAR_HEAD_UNIT": "https://images.unsplash.com/photo-1552650272-b8a34e21bc4b?q=80&w=800",
    "CAR_AMPLIFIER": "https://images.unsplash.com/photo-1616423641454-99602492f155?q=80&w=800",
    "CAR_SUBWOOFER": "https://images.unsplash.com/photo-1545412760-706790e7293b?q=80&w=800",
    "CAR_SPEAKERS": "https://images.unsplash.com/photo-1589129140837-67287c22521b?q=80&w=800",
    "CAR_SECURITY": "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800",
    "CAR_REMOTE_START": "https://images.unsplash.com/photo-1517404212738-192634360a72?q=80&w=800",
    "CAR_LIGHTING": "https://images.unsplash.com/photo-1506469717960-433cebe3f181?q=80&w=800",
    "CAR_CUSTOM": "https://images.unsplash.com/photo-1549917973-32e92463bb17?q=80&w=800",
    "MARINE_HEAD_UNIT": "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=800",
    "MARINE_AMPLIFIER": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800",
    "MARINE_SUBWOOFER": "https://images.unsplash.com/photo-1520110120385-fe274789ebed?q=80&w=800",
    "MARINE_SPEAKERS": "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800",
    "MARINE_TOWER_SPK": "https://images.unsplash.com/photo-1608155613953-d1fea47486d7?q=80&w=800",
    "MARINE_LIGHTING": "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800",
    "MARINE_SECURITY": "https://images.unsplash.com/photo-1557597774-9d2739f85a94?q=80&w=800",
    "MARINE_CUSTOM": "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=800",
    "TRUCK_REMOTE_START": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800",
    "TRUCK_SECURITY": "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=800",
    "TRUCK_LIGHTING": "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800",
    "TRUCK_AMPLIFIER": "https://images.unsplash.com/photo-1493238555221-d2aa9f29b978?q=80&w=800",
    "TRUCK_SUBWOOFER": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800",
    "TRUCK_HEAD_UNIT": "https://images.unsplash.com/photo-1552650272-b8a34e21bc4b?q=80&w=800",
    "TRUCK_CUSTOM": "https://images.unsplash.com/photo-1549917973-32e92463bb17?q=80&w=800",
}

lines = product_list.strip().split('\n')
sql_statements = []

for line in lines[2:]:
    parts = [p.strip() for p in line.split('|')]
    if len(parts) < 6: continue
    
    v_type = parts[1]
    cat = parts[2]
    brand = parts[3]
    model = parts[4]
    
    full_name = f"{brand} {model}"
    
    # Escape single quotes for SQL
    full_name_sql = full_name.replace("'", "''")
    
    img_url = image_mapping.get(full_name)
    if not img_url:
        key = f"{v_type}_{cat}"
        img_url = category_defaults.get(key, "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2")
    
    desc = f"Professional {v_type.lower()} {cat.lower().replace('_', ' ')} from {brand}. Model: {model}. Expert installation available."
    desc_sql = desc.replace("'", "''")
    
    sql = f"UPDATE products SET image_url = '{img_url}', description = '{desc_sql}' WHERE name = '{full_name_sql}';"
    sql_statements.append(sql)

with open('update_images.sql', 'w') as f:
    f.write('\n'.join(sql_statements))
