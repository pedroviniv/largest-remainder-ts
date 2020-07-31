import Big from "big.js";

/**
 * Calcula o valor numerico de acordo com o valorPorcentagem passado por parametro.
 * @param valorNumerico valor numerico total
 * @param valorPorcentagem porcentagem do valor numerico do valor numerico total
 */
function calcularValorCorrespondente(
  valorNumerico: number,
  valorPorcentagem: number
) {
  if (valorNumerico === 0 || valorPorcentagem === 0) {
    return 0;
  }
  // console.log('calcularValorCorrespondente', valorPorcentagem);

  const valorNumericoBig = Big(valorNumerico);
  const valorPorcentagemBig = Big(valorPorcentagem / 100);

  return valorNumericoBig.times(valorPorcentagemBig).round().toString();
}

/**
 * Função que distribui uma determinada amostra entre as porcentagens passadas
 * por parametro.
 *
 * O arredondamento das cotas numéricas funcionam da seguinte forma:
 * o valor é calculado para cada porcentagem e truncado, ao final é visto
 * se sobrou ou faltou cota numerica, caso tenha faltado, 1 unidade é acrescida para cada
 * cota até atingir o valor esperado. Caso contrário, o mesmo será feito porém desta vez
 * será decrecida 1 unidade de cada cota até atingir o valor esperado.
 *
 * O acrescimo de cota valor é feito do maior para o menor;
 * O decremento é feito do menor para o maior;
 *
 * @param total Amostras a serem distribuidas
 * @param numbers Array contendo as cotas percentuais a serem distribuidas
 */
function largestRemainder(total: number, numbers: number[]): number[] {
  if (!numbers || numbers.length === 0) {
    return [];
  }

  // tslint:disable-next-line: max-line-length
  const cotasNumericas = numbers
    .map((porcentagen) => calcularValorCorrespondente(total, porcentagen))
    .map(Number);

  const totalCotasNumericas = cotasNumericas.reduce(
    (parcela, total) => parcela + total
  );
  const isIncrementOperation = total - totalCotasNumericas > 0;
  let diferencaAmostrasCotaNumerica = Math.abs(total - totalCotasNumericas);

  /**
   * Fazemos os incrementos baseado na cota numerica ordenada.
   * Aqui ordenamos de maneira crescente/decrescente de acordo
   * com a nescessidade
   */
  // tslint:disable-next-line: max-line-length
  const contaNumericaOrdenada: {
    cotaNumerica: number;
    index: number;
  }[] = cotasNumericas
    .map((cotaNumerica, index) => {
      return {
        cotaNumerica,
        index,
      };
      // tslint:disable-next-line: max-line-length
    })
    .sort((a, b) =>
      isIncrementOperation
        ? b.cotaNumerica - a.cotaNumerica
        : a.cotaNumerica - b.cotaNumerica
    );

  /**
   * Marcador indicando qual a proxima cota a ser compensada
   */
  let indiceProximaAdicao = 0;
  while (diferencaAmostrasCotaNumerica !== 0) {
    const cotaNumericaOrdenada = contaNumericaOrdenada[indiceProximaAdicao];
    const cotaNumerica = cotasNumericas[cotaNumericaOrdenada.index];
    let compensacaoRealizada = false;

    if (totalCotasNumericas > total && cotaNumerica > 0) {
      cotasNumericas[cotaNumericaOrdenada.index] = cotaNumerica - 1;
      compensacaoRealizada = true;
    }

    if (totalCotasNumericas < total) {
      cotasNumericas[cotaNumericaOrdenada.index] = cotaNumerica + 1;
      compensacaoRealizada = true;
    }

    /**
     * Caso a proxima adição estrapole a quantidade de cotas
     * disponiveis, voltaos para o inicio do array
     */
    indiceProximaAdicao = indiceProximaAdicao + 1;
    if (indiceProximaAdicao >= cotasNumericas.length) {
      indiceProximaAdicao = 0;
    }

    /**
     * Nem sempre a compensação pode ser feita, por exemplo,
     * não podemos decrementar uma conta numerica de valor 0
     */
    if (compensacaoRealizada) {
      diferencaAmostrasCotaNumerica = diferencaAmostrasCotaNumerica - 1;
    }
  }

  return cotasNumericas;
}

export default largestRemainder;
