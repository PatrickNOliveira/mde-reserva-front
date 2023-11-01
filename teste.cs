 public List<HistoricoDoContrato> ListaHistoricosParaTratamento(
 int IdContrato,
 int[] Patrocinadoras,
 int[] Planos,
 int[] ConsiderarContratosDoArquivo,
 int[] NaoConsiderarContratosDoArquivo,
 TipoDeEmprestimo TipoDeEmprestimo,
 Modalidade Modalidade,
 AnoMesDeReferencia AnoMesCompetencia,
 AnoMesDeReferencia AnoMesCobranca,
 int[] DestinosDeEnvio,
 StatusDoContratoEnum[] StatusDoContrato,
 TipoDeDivergenciaEnum[] TiposDeDivergencia,
 bool ConsiderarDivergentesProprioMesCobranca,
 bool FiltrarPorMesCobranca,
 int[] SituacaoParticipanteTitular,
 int[] TipoSuspensao,
 OpcoesFiltroContratoEnum? TipoDeSuspensao,
 TipoDeCompetenciaEnum? TipoDeCompetencia,
 DateTime? DataProgramada,
 int QtdParcelasAntigas)
 {
     try
     {

         var historicos = Resolve<IHistoricoDoContratoRepository>()
             .ListAllQueryable()
             .Where(x =>
                 x.StatusDoItem == StatusDoItemEnum.EmAberto
                 && (
                     x.TipoDeMovimentacao == TipoDeMovimentacaoEnum.Prestacao ||
                     x.TipoDeMovimentacao == TipoDeMovimentacaoEnum.Amortizacao ||
                     x.TipoDeMovimentacao == TipoDeMovimentacaoEnum.Quitacao
                 )
             );

         if (TiposDeDivergencia.Length > 0)
         {
             if (TiposDeDivergencia.Contains(TipoDeDivergenciaEnum.ValorNaoRecebido))
             {
                 historicos = historicos.Where(x => x.TipoDeDivergencia == null || TiposDeDivergencia.Contains(x.TipoDeDivergencia.Value));
             }
             else
             {
                 historicos = historicos.Where(x => TiposDeDivergencia.Contains(x.TipoDeDivergencia.Value));
             }
         }

         if (FiltrarPorMesCobranca)
         {
             historicos = historicos.Where(x => x.AnoMesCobranca == AnoMesCobranca);
         }
         if (IdContrato > 0)
             historicos = historicos.Where(x => x.Contrato.Id == IdContrato);


         if (Modalidade != null)
             historicos = historicos.Where(x => x.Contrato.Modalidade == Modalidade);

         if (TipoDeEmprestimo != null)
             historicos = historicos.Where(x => x.Contrato.Modalidade.TipoDeEmprestimo == TipoDeEmprestimo);


         switch (DestinosDeEnvio.Length)
         {
             case 1:
                 if (DestinosDeEnvio.Contains(1)) //FolhaPatro
                     historicos = historicos.Where(x => x.DestinoDaCobranca == DestinoDaCobrancaEnum.FolhaPatrocinadora);

                 if (DestinosDeEnvio.Contains(2)) //FolhaBenef
                     historicos = historicos.Where(x => x.DestinoDaCobranca == DestinoDaCobrancaEnum.FolhaBeneficios);

                 if (DestinosDeEnvio.Contains(3)) //Financeiro
                     historicos = historicos.Where(x => x.DestinoDaCobranca == DestinoDaCobrancaEnum.Financeiro);

                 break;
             case 2:
                 if (DestinosDeEnvio.Contains(1) && DestinosDeEnvio.Contains(2))
                     historicos = historicos.Where(x => x.DestinoDaCobranca == DestinoDaCobrancaEnum.FolhaBeneficios);

                 if (DestinosDeEnvio.Contains(1) && DestinosDeEnvio.Contains(3))
                     historicos = historicos.Where(x => x.DestinoDaCobranca == DestinoDaCobrancaEnum.FolhaPatrocinadora || x.DestinoDaCobranca == DestinoDaCobrancaEnum.Financeiro);

                 if (DestinosDeEnvio.Contains(2) && DestinosDeEnvio.Contains(3))
                     historicos = historicos.Where(x => x.DestinoDaCobranca == DestinoDaCobrancaEnum.FolhaBeneficios || x.DestinoDaCobranca == DestinoDaCobrancaEnum.Financeiro);

                 break;
             case 3:

                 break;
         }

         if (DataProgramada != null)
         {
             historicos = historicos.Where(x => x.DataProgramada <= DataProgramada);
         }


         if (StatusDoContrato.Length > 0)
             historicos = historicos.Where(x => StatusDoContrato.Contains(x.Contrato.StatusDoContrato));

         if (SituacaoParticipanteTitular.Count() > 0)
         {
             historicos = historicos.Where(x => SituacaoParticipanteTitular.Contains(x.Contrato.SituacaoDoParticipanteNaFundacao.Id));
         }


         if (TipoSuspensao.Count() > 0)
         {
             historicos = historicos.Where(x => TipoSuspensao.Contains(Convert.ToInt32(x.Contrato.HistoricoDeSuspensaoAtual.TipoDeSuspensao.Codigo)));

             //Trata Suspensoes
             if (TipoDeSuspensao != null)
             {
                 if (TipoDeSuspensao.Value == OpcoesFiltroContratoEnum.CosideraSomenteSuspensoes)
                 {
                     historicos = historicos.Where(x => TipoSuspensao.Contains(Convert.ToInt32(x.Contrato.HistoricoDeSuspensaoAtual.TipoDeSuspensao.Codigo)));
                 }
                 if (TipoDeSuspensao.Value == OpcoesFiltroContratoEnum.SemSuspensoesOuSelec)
                 {
                     historicos = historicos.Where(x => TipoSuspensao.Contains(Convert.ToInt32(x.Contrato.HistoricoDeSuspensaoAtual.TipoDeSuspensao.Codigo)) || x.Contrato.HistoricoDeSuspensaoAtual == null);
                 }
                 if (TipoDeSuspensao.Value == OpcoesFiltroContratoEnum.Todos)
                 {
                     historicos = historicos.Where(x => x.Contrato.HistoricoDeSuspensaoAtual != null);
                 }
             }
         }



         if (QtdParcelasAntigas > 0)
         {
             var idsFiltros = historicos.Where(y => historicos.Any(x => x.Contrato.Id == y.Contrato.Id))
                                        .OrderBy(x => x.Contrato.Id)
                                        .ThenBy(x => x.Id)
                                        .Take(QtdParcelasAntigas)
                                        .Select(x => x.Id);

             historicos = historicos.Where(x => idsFiltros.Contains(x.Id));


         }

         if (TipoDeCompetencia != null && TipoDeCompetencia.Value > 0)
         {

             if (TipoDeCompetenciaEnum.CosideraSomentedaCompt == TipoDeCompetencia.Value)
             {
                 historicos = historicos.Where(x => x.AnoMesCompetencia == AnoMesCompetencia);
             }
         }



         if (Patrocinadoras.Length > 0)
             historicos = historicos.Where(x => Patrocinadoras.Contains(x.Contrato.ParticipantePorPlano.Patrocinadora.Id));

         if (Planos.Length > 0)
             historicos = historicos.Where(x => Planos.Contains(x.Contrato.ParticipantePorPlano.PlanoPrevidenciario.Id));

         var historicosFiltrados = new List<HistoricoDoContrato>();

         var historicosContains = new List<HistoricoDoContrato>();
         if (NaoConsiderarContratosDoArquivo.Length > 0)
         {

             for (int i = 0; i < NaoConsiderarContratosDoArquivo.Length; i += 1000)
             {
                 var parcial = NaoConsiderarContratosDoArquivo.Skip(i).Take(1000).ToArray();
                 historicosContains.AddRange(historicos.Where(x => !parcial.Contains(x.Contrato.Id)).ToList());
             }

             historicosFiltrados = historicosContains.ToList();
         }


         if (ConsiderarContratosDoArquivo.Length > 0)
         {

             for (int i = 0; i < ConsiderarContratosDoArquivo.Length; i += 1000)
             {
                 var parcial = ConsiderarContratosDoArquivo.Skip(i).Take(1000).ToArray();
                 historicosContains.AddRange(historicos.Where(x => parcial.Contains(x.Contrato.Id)).ToList());
             }

             historicosFiltrados = historicosContains.ToList();
         }
         if (historicosFiltrados.None())
         {
             historicosFiltrados = historicos.ToList();
         }

         if (TipoDeCompetencia != null && TipoDeCompetencia.Value > 0 && TipoDeCompetencia.Value == TipoDeCompetenciaEnum.ConsiderAteCompt)
         {
             historicosFiltrados = historicosFiltrados.Where(x => x.AnoMesCompetencia.IsLessThan(AnoMesCompetencia.AddMeses(1))).ToList();
         }

         if (ConsiderarDivergentesProprioMesCobranca)
             historicosFiltrados = historicosFiltrados.Where(x => x.AnoMesCobranca.IsLessThan(AnoMesCobranca.AddMeses(1))).ToList();

         var historicosComDivergencia = historicosFiltrados.Where(x => x.TipoDeDivergencia != null || (x.TipoDeDivergencia == null && (x.ValorEfetivo == null || x.ValorEfetivo == 0)));


         return historicosComDivergencia.OrderBy(x => x.Contrato.Id).ThenBy(x => x.Parcela).ThenBy(x => x.AnoMesCompetencia).ToList();

     }
     catch (Exception ex)
     {
         throw ex;
     }
 }
