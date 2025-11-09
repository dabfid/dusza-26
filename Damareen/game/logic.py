def isEnemyWinning(player, enemy):
    """
    Eldönti, hogy a második kártya (ellenfél) nyer-e.
    Type:
    0 föld
    1 víz
    2 tűz
    3 levegő
    """
    win = {
      2: 0,  # tűz legyőzi földet
      0: 1,  # föld legyőzi vizet
      1: 3,  # víz legyőzi levegőt
      3: 2   # levegő legyőzi tüzet
    }
    
    player_kills_enemy = int(player['cardDmg']) >= int(enemy['cardHp'])
    enemy_kills_player = int(enemy['cardDmg']) >= int(player['cardHp'])
    # Ha csak a játékos öl
    if player_kills_enemy and not enemy_kills_player:
        return False  # Játékos nyer
    
    # Ha csak az ellenfél öl
    if enemy_kills_player and not player_kills_enemy:
        return True  # Ellenfél nyer
    
    # Ha mindkét kártya megöli egymást VAGY egyik sem öli meg a másikat
    # -> típus alapján döntünk
    
    # Ellenőrizzük, hogy a játékos típusa legyőzi-e az ellenfélét
    if win.get(player['cardType']) == enemy['cardType']:
        return False  # Játékos nyer típus miatt
    
    # Minden más esetben (döntetlen vagy ellenfél nyer típus alapján)
    return True  # Ellenfél nyer