from PIL import Image, ImageDraw, ImageFont
import os
import math

os.makedirs('thumbnails', exist_ok=True)

# Colors matching the editorial palette
BG_DARK = (18, 17, 14)
CRIMSON = (140, 29, 47)
TEAL = (19, 138, 107)
RUST = (187, 63, 14)
PAPER = (225, 221, 211)
PAPER_MUTED = (160, 155, 142)
PAPER_DIM = (100, 95, 85)
GOLD = (212, 163, 89)

W, H = 720, 1280

windir = os.environ.get('WINDIR', 'C:/Windows')
font_bold_path = os.path.join(windir, 'Fonts', 'arialbd.ttf')
font_mono_path = os.path.join(windir, 'Fonts', 'consolab.ttf')

font_badge = ImageFont.truetype(font_mono_path, 20)
font_tc = ImageFont.truetype(font_mono_path, 20)
font_micro = ImageFont.truetype(font_mono_path, 18)
font_title = ImageFont.truetype(font_bold_path, 42)
font_sub = ImageFont.truetype(font_mono_path, 20)
font_foot = ImageFont.truetype(font_mono_path, 16)
font_pill = ImageFont.truetype(font_bold_path, 18)

configs = [
    {
        'key': 'speed_ramping',
        'num': '01',
        'badge': '01 // SPEED RAMPING',
        'badge_color': CRIMSON,
        'title': 'SPEED RAMPING',
        'sub': 'VELOCITY CURVES & DYNAMIC PACING',
        'metric': 'FRAME-ACCURATE FLOW',
        'tc': '00:00:18:14',
        'type': 'curve'
    },
    {
        'key': 'subtitles',
        'num': '02',
        'badge': '02 // KINETIC SUBTITLES',
        'badge_color': RUST,
        'title': 'KINETIC SUBTITLES',
        'sub': 'WORD-BY-WORD HOOK CAPTIONS',
        'metric': 'ZERO DEAD FRAMES',
        'tc': '00:00:24:08',
        'type': 'captions'
    },
    {
        'key': 'color_grading',
        'num': '03',
        'badge': '03 // COLOR GRADING',
        'badge_color': TEAL,
        'title': 'COLOR GRADING',
        'sub': 'LOG TO COMMERCIAL REC.709',
        'metric': 'FILM EMULATION GRADE',
        'tc': '00:00:28:19',
        'type': 'grade'
    },
    {
        'key': 'storytelling',
        'num': '04',
        'badge': '04 // STORYTELLING',
        'badge_color': GOLD,
        'title': 'STORYTELLING',
        'sub': 'THREE-ACT TENSION & NARRATIVE',
        'metric': 'EMOTIONAL HOOK & ARC',
        'tc': '00:00:32:04',
        'type': 'story'
    }
]

for cfg in configs:
    im = Image.new('RGB', (W, H), BG_DARK)
    draw = ImageDraw.Draw(im)
    
    # Outer film gate border
    draw.rectangle([24, 24, W-25, H-25], outline=(50, 46, 38), width=2)
    draw.rectangle([34, 34, W-35, H-35], outline=(32, 29, 24), width=1)
    
    # Corner registration crosshairs
    for cx_c, cy_c in [(44, 44), (W-45, 44), (44, H-45), (W-45, H-45)]:
        draw.line([cx_c-14, cy_c, cx_c+14, cy_c], fill=PAPER_MUTED, width=2)
        draw.line([cx_c, cy_c-14, cx_c, cy_c+14], fill=PAPER_MUTED, width=2)
        
    # Top header bar
    draw.rectangle([54, 54, W-55, 120], fill=(28, 26, 22))
    draw.rectangle([54, 54, W-55, 120], outline=(60, 54, 44), width=1)
    
    # Status light
    draw.ellipse([72, 79, 90, 97], fill=cfg['badge_color'])
    
    # Badge text
    draw.text((106, 76), cfg['badge'], font=font_badge, fill=PAPER)
    draw.text((W-210, 76), cfg['tc'], font=font_tc, fill=PAPER_MUTED)
    
    # Center visual micro graphic
    cx, cy = W // 2, H // 2 - 40
    
    # Circular lens frame
    draw.ellipse([cx-200, cy-200, cx+200, cy+200], outline=(48, 44, 36), width=2)
    draw.ellipse([cx-240, cy-240, cx+240, cy+240], outline=(32, 29, 24), width=1)
    
    # Subtle radial ticks around lens
    for angle in range(0, 360, 30):
        rad = math.radians(angle)
        x1 = cx + int(190 * math.cos(rad))
        y1 = cy + int(190 * math.sin(rad))
        x2 = cx + int(200 * math.cos(rad))
        y2 = cy + int(200 * math.sin(rad))
        draw.line([x1, y1, x2, y2], fill=(65, 60, 50), width=1)
    
    if cfg['type'] == 'curve':
        # Speed ramp curve
        pts = [(cx-150, cy+70), (cx-70, cy+60), (cx-10, cy-110), (cx+50, cy+80), (cx+150, cy-50)]
        for i in range(len(pts)-1):
            draw.line([pts[i], pts[i+1]], fill=CRIMSON, width=6)
        for p in pts:
            draw.ellipse([p[0]-8, p[1]-8, p[0]+8, p[1]+8], fill=PAPER)
        draw.text((cx-25, cy-150), '400%', font=font_micro, fill=CRIMSON)
        draw.text((cx-145, cy+85), '100%', font=font_micro, fill=PAPER_MUTED)
        draw.text((cx+125, cy-35), '25%', font=font_micro, fill=PAPER_MUTED)
        
    elif cfg['type'] == 'captions':
        # Subtitle caption pill
        draw.rounded_rectangle([cx-180, cy-60, cx+180, cy+60], radius=16, fill=(35, 32, 26), outline=RUST, width=2)
        draw.text((cx-150, cy-28), 'HOOK THEM IN FRAME ONE', font=font_badge, fill=PAPER)
        draw.rectangle([cx-150, cy+18, cx+20, cy+22], fill=RUST)
        draw.text((cx-150, cy+28), 'ACTIVE KARAOKE HIGHLIGHT', font=font_micro, fill=RUST)
        
    elif cfg['type'] == 'grade':
        # Color grade split
        draw.rectangle([cx-160, cy-100, cx, cy+100], fill=(28, 32, 30))
        draw.rectangle([cx, cy-100, cx+160, cy+100], fill=(55, 38, 25))
        draw.line([cx, cy-115, cx, cy+115], fill=TEAL, width=3)
        draw.text((cx-140, cy+115), 'LOG FLAT', font=font_micro, fill=PAPER_MUTED)
        draw.text((cx+20, cy+115), 'REC.709 GRADE', font=font_micro, fill=TEAL)
        
    elif cfg['type'] == 'story':
        # Three act mountain arc
        draw.polygon([(cx-150, cy+70), (cx-50, cy+15), (cx, cy+40), (cx+70, cy-100), (cx+150, cy+70)], outline=GOLD, width=4)
        draw.text((cx-140, cy+85), 'SETUP', font=font_micro, fill=PAPER_MUTED)
        draw.text((cx-25, cy+85), 'CONFLICT', font=font_micro, fill=PAPER_MUTED)
        draw.text((cx+75, cy+85), 'PAYOFF', font=font_micro, fill=GOLD)

    # Large Center Play button
    draw.ellipse([cx-52, cy-52, cx+52, cy+52], fill=cfg['badge_color'])
    draw.polygon([(cx-16, cy-25), (cx-16, cy+25), (cx+26, cy)], fill=(255, 255, 255))
    
    # Bottom information block
    draw.rectangle([54, H-290, W-55, H-54], fill=(24, 22, 18))
    draw.rectangle([54, H-290, W-55, H-54], outline=(55, 50, 42), width=1)
    
    # Metric tag pill
    m_bbox = font_pill.getbbox(cfg['metric'])
    m_w = m_bbox[2] - m_bbox[0] + 32
    draw.rounded_rectangle([74, H-270, 74 + m_w, H-230], radius=8, fill=cfg['badge_color'])
    draw.text((90, H-258), cfg['metric'], font=font_pill, fill=(255, 255, 255))
    
    # Main project title
    draw.text((74, H-215), cfg['title'], font=font_title, fill=PAPER)
    draw.text((74, H-155), cfg['sub'], font=font_sub, fill=PAPER_MUTED)
    draw.text((74, H-105), 'ROHIT RAJPUT // 9:16 MASTER SHOWCASE', font=font_foot, fill=PAPER_DIM)

    out_file = f"thumbnails/poster_{cfg['key']}.jpg"
    im.save(out_file, quality=94)
    print(f"Generated upgraded poster {out_file}")
