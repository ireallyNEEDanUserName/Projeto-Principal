def loop2(qtd, inicial, achar, valor = 0, atual = 0):
    
    string = ["0" , "2" , "b" , "c", "3", "6" , "7" ,
              "8" , "9" , "1" , "a" , "%", "@"];

    for x in range(0, len(string)):

        if isinstance(achar, int):
            if achar == valor:
                return atual, valor
        else:
            if achar == inicial:
                return atual, valor

        if atual == qtd:
            valor += 1
        
        inicial[atual] = string[x]
        x += 1

        if atual < qtd and x <= len(string):
            atual += 1
            atual, valor = loop2(qtd, inicial, achar, valor, atual)    
            
    atual -= 1
    return atual, valor



end = False
inicial = ["0", "0", "0", "0"]
achar = ["c", "b", "3", "0"]
atual = 0
valor = 0
#achar = 10000

valor = loop2(len(inicial) - 1, inicial, achar)

print "Valor: " + str(valor) + " codigo: " + str(inicial)


