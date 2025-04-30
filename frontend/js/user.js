const url = "http://localhost:7890";


// #############################################################
// #############################################################
// #############################################################
// ######################### ROUTES ############################
// #############################################################
// #############################################################
// #############################################################

// #############################################################
// ########################## GET ##############################
// #############################################################
$(document).ready(function() {

    chargerGroupes();
    chargerMembres();
    chargerTaches();


    // Permet de charger les groupes au lancement de la page
    function chargerGroupes() {
        $.ajax({
            type: 'GET',
            url: url + '/groupes',
            success: function(response) {
                if (response.success) {
                    response.groupes.forEach(groupes => {
                        ajouterGroupeALaListe(groupes.id_groupe, groupes.name, groupes.couleur, groupes.nb_membre, groupes.en_cours);
                    });
                } else {
                    afficherPopupErreur('Erreur lors du chargement des groupes');
                }
            },
            error: function() {
                afficherPopupErreur('Erreur serveur');
            }
        });
    }
    // Permet de charger les membres au lancement de la page
    function chargerMembres() {
        $.ajax({
            type: 'GET',
            url: url + '/membres',
            success: function(response) {
                if (response.success) {
                    response.membres.forEach(membre => {
                        membres = response.membres.map(membre => ({
                            id: membre.id_membre,
                            name: membre.name
                        }));
                        ajouterMembreALaListe(membre.id_membre, membre.name);
                    });
                } else {
                    afficherPopupErreur('Erreur lors du chargement des membres');
                }
            },
            error: function() {
                afficherPopupErreur('Erreur serveur');
            }
        });
    }
    // Permet de charger les taches au lancement de la page
    function chargerTaches() {
        $.ajax({
            type: 'GET',
            url: url + '/taches',
            success: function(response) {
                if (response.success) {
                    response.taches.forEach(tache => {
                        ajouterTacheALaListe(tache.id_tache, tache.nom, tache.description, tache.niveau, tache.deadline, tache.nb_condition_ok, tache.nb_condition_total, tache.terminée);
                    });
                } else {
                    afficherPopupErreur('Erreur lors du chargement des membres');
                }
            },
            error: function() {
                afficherPopupErreur('Erreur serveur');
            }
        });
    }
    
});
function chargerMembresGroupes() {
    $.ajax({
        type: 'GET',
        url: url + '/membres-groupes',
        success: function(response) {
            if (response.success) {
                response.groupes.forEach(groupe => {
                    groupe.membres.forEach(membre => {
                        const { id_membre, name } = membre;
                        ajouterMembreALaListeDansGroupe(id_membre, name, groupe.id_groupe);
                    });
                });    
            } else {
                afficherPopupErreur('Erreur lors du chargement des membres');
            }
        },
        error: function() {
            afficherPopupErreur('Erreur serveur');
        }
    });
}
// #############################################################
// ########################## POST #############################
// #############################################################
function AjouterUnGroupe(name, couleur, membres) {
    $.ajax({
        type: 'POST',
        url: url + '/ajouter-groupe',
        contentType: 'application/json',
        data: JSON.stringify({ name: name, couleur: couleur, membres: membres }),
        success: function(response) {
            if (response.success) {
                ajouterGroupeALaListe(response.id_groupe, name, couleur, response.nb_membre);
                afficherPopupSucces(response.message);
                $('input.inputNomDuGroupe').val('');
                $('.TousCeuxAjoute').empty();
                
            } else {
                afficherPopupErreur(response.message);
            }
        },
        error: function(jqXHR) {
            // Utiliser jqXHR.responseJSON pour obtenir le message d'erreur du serveur
            const response = jqXHR.responseJSON;
            if (response && response.message) {
                afficherPopupErreur(response.message);
            } else {
                afficherPopupErreur('Erreur serveur');
            }
        }
    });
}
function AjouterUnMembre(name) {
    $.ajax({
        type: 'POST',
        url: url + '/ajouter-membre/' + encodeURIComponent(name),
        success: function(response) {
            if (response.success) {
                const nouveauMembre = { id: response.result.id_membre, name: name };
                membres.push(nouveauMembre);

                afficherPopupSucces(response.message);
                $('input.NewMembre').val(''); // Réinitialiser le champ de saisie
                ajouterMembreALaListe(response.result.id_membre, name); // Ajouter le nouveau membre à la liste
            } else {
                afficherPopupErreur('Erreur lors de l\'ajout du membre');
            }
        },
        error: function() {
            afficherPopupErreur('Erreur serveur');
        }
    });
}
function AjouterTache(nom, niveau, deadline, idGroupe) {
    $.ajax({
        url: url + '/ajouterTache',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ nom, niveau, deadline, idGroupe }),
        success: function(data) {
            if (data.success) {
                afficherPopupSucces(data.message);
                ajouterTacheALaListe(data.id_tache, nom);
                viderChamps();
            } else {
                afficherPopupErreur('Erreur lors de l\'ajout de la tâche');
                viderChamps();
            }
        },
        error: function(xhr, status, error) {
            console.error('Erreur:', error);
            afficherPopupErreur('Erreur lors de l\'ajout de la tâche');
            viderChamps();
        }
    });
}
function ajouterMembreAuGroupe(id_membre, name, id_groupe) {
    const membresADeplacerDiv = document.getElementById(`ListeDesMembresDansSousLigneDuHautAAjouter_${id_groupe}`);

    // Vérifier si le membre est déjà dans la liste avant de faire l'ajax request
    if (!membresADeplacerDiv.querySelector(`[data-id="${id_membre}"]`)) {
        $.ajax({
            type: 'POST',
            url: url + `/groupes/${id_groupe}/membres`,
            contentType: 'application/json',
            data: JSON.stringify({ id_membre: id_membre, name: name }),
            success: function(response) {
                if (response.success) {
                    ajouterMembreALaListeDansGroupe(id_membre, name, id_groupe); // Ajouter le membre à la liste visible
                    afficherPopupSucces(name + " ajouté")

                    const nbMembresElement = document.querySelector(`[data-id="${id_groupe}"] .nbMembres`);
                    if (nbMembresElement) {
                        let nbMembres = parseInt(nbMembresElement.textContent, 10);
                        nbMembresElement.textContent = nbMembres + 1;
                    }
                } else {
                    console.error('Erreur lors de l\'ajout du membre:', response.message);
                }
            },
            error: function(error) {
                console.error('Erreur lors de l\'ajout du membre:', error);
            }
        });
    } else {
        afficherPopupErreur(name + " est déjà dans la liste.");
    }
}
// #############################################################
// ######################### DELETE ############################
// #############################################################
function supprimerMembre(id_membre, element) {
    $.ajax({
        type: 'DELETE',
        url: url + '/supprimer-membre/' + id_membre,
        success: function(response) {
            if (response.success) {
                afficherPopupSucces(response.message);
                element.remove(); // Supprimer l'élément de la liste

                // Supprimer le membre de la div LesMembresADeplacer
                const membresADeplacer = document.querySelector('.LesMembresADeplacer');
                const membreEnAttente = membresADeplacer.querySelector(`[data-id="${id_membre}"]`);
                if (membreEnAttente) {
                    membreEnAttente.remove();
                }

                // Supprimer le membre de la liste de recherche
                const resultatsRecherche = document.querySelectorAll('.resultatsRecherche');
                resultatsRecherche.forEach(resultat => {
                    const membreEnRecherche = resultat.querySelector(`[data-id="${id_membre}"]`);
                    if (membreEnRecherche) {
                        membreEnRecherche.remove();
                    }
                });

                // Supprimer le membre de la variable globale 'membres'
                membres = membres.filter(membre => membre.id !== id_membre);

                // Mettre à jour tous les groupes contenant ce membre
                const groupesAvecMembre = document.querySelectorAll(`.ListeDesMembresDansSousLigneDuHautAAjouter [data-id="${id_membre}"]`);
                groupesAvecMembre.forEach(membreEnGroupe => {
                    console.log('Groupe avant suppression:', membreEnGroupe);

                    const groupeElement = membreEnGroupe.closest('.GroupeDansGestion');
                    const nbMembresElement = groupeElement.querySelector('.nbMembres');
                    membreEnGroupe.remove(); // Supprimer le membre de la liste du groupe

                    if (nbMembresElement) {
                        let nbMembres = parseInt(nbMembresElement.textContent, 10);
                        nbMembresElement.textContent = nbMembres - 1; // Mettre à jour le compteur de membres
                        console.log('Nb membres mis à jour pour le groupe:', groupeElement);
                    }
                });
            } else {
                afficherPopupErreur('Erreur lors de la suppression du membre');
            }
        },
        error: function() {
            afficherPopupErreur('Erreur serveur');
        }
    });
}   
function supprimerGroupe(id_groupe) {
    $.ajax({
        type: 'DELETE',
        url: url + `/supprimer-groupe/${id_groupe}`,
        success: function(response) {
            if (response.success) {
                afficherPopupSucces(response.message);
                document.querySelector(`.GroupeDansGestion[data-id="${id_groupe}"]`).remove();
                document.querySelector(`.ajouterGroupeButton[data-id="${id_groupe}"]`).remove();


            } else {
                afficherPopupErreur(response.message);
            }
        },
        error: function(jqXHR) {
            const response = jqXHR.responseJSON;
            if (response && response.message) {
                afficherPopupErreur(response.message);
            } else {
                afficherPopupErreur('Erreur serveur');
            }
        }
    });
}
function supprimerTache(id_tache) {
    $.ajax({
        type: 'DELETE',
        url: url + `/supprimer-tache/${id_tache}`,
        success: function(response) {
            if (response.success) {
                afficherPopupSucces(response.message);
                document.querySelector(`.GroupeDansGestion[data-id-tache="${id_tache}"]`).remove();
            } else {
                afficherPopupErreur(response.message);
            }
        },
        error: function(jqXHR) {
            const response = jqXHR.responseJSON;
            if (response && response.message) {
                afficherPopupErreur(response.message);
            } else {
                afficherPopupErreur('Erreur serveur');
            }
        }
    });
}
async function supprimerMembreModif(id_groupe, id_membre, membreDiv, name) {
    try {
        const response = await fetch(url + `/groupes/${id_groupe}/membres/${id_membre}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
            membreDiv.remove(); // Supprimer le membre de la liste
            afficherPopupSucces(name + " supprimé");

            const nbMembresElement = document.querySelector(`[data-id="${id_groupe}"] .nbMembres`);
            if (nbMembresElement) {
                let nbMembres = parseInt(nbMembresElement.textContent, 10);
                nbMembresElement.textContent = nbMembres - 1;
            }
        } else {
            afficherPopupErreur('Erreur lors de la suppression du membre');
            console.error('Erreur lors de la suppression du membre:', data.message);
        }
    } catch (error) {
        afficherPopupErreur('Erreur lors de la suppression du membre');
        console.error('Erreur lors de la suppression du membre:', error);
    }
}


// #############################################################
// ##################### Fonction mère #########################
// #############################################################
function ajouterGroupeALaListe(id_groupe, name, couleur, nb_membre, en_cours) {
    creerBoutonGroupe(id_groupe, name, couleur, nb_membre, en_cours);
    creerSectionGroupeAvecMembres(id_groupe, name, couleur, nb_membre);
}
function ajouterMembreALaListe(id_membre, name) {
    ajouterMembreALaListeGestion(id_membre, name);
    ajouterMembreALaListeNouveauGroupe(id_membre, name);
}
function ajouterTacheALaListe(id_tache, nom, description, niveau, deadline, nb_condition_ok, nb_condition_total, terminée) {
    creerSectionTaches(id_tache, nom, description, niveau, deadline);
    creerSectionTachesDansGroupe(id_tache, nom, description, niveau, deadline);
}





// #############################################################
// ######################## Popups #############################
// #############################################################
function afficherPopupErreur(message) {
    const popup = document.getElementById('popupErreur');
    const messageElement = document.getElementById('messageErreur');
    messageElement.textContent = message;
    popup.style.display = 'block';
    popup.style.opacity = 1;
    popup.style.animation = 'slideDown 0.5s forwards';
    setTimeout(function() {
        popup.style.animation = 'slideUp 0.5s forwards';
        setTimeout(function() {
            popup.style.display = 'none';
        }, 500);
    }, 3000);
}
function afficherPopupSucces(message) {
    const popup = document.getElementById('popupSucces');
    const messageElement = document.getElementById('messageSucces');
    messageElement.textContent = message;
    popup.style.display = 'block';
    popup.style.opacity = 1;
    popup.style.animation = 'slideDown 0.5s forwards';
    setTimeout(function() {
        popup.style.animation = 'slideUp 0.5s forwards';
        setTimeout(function() {
            popup.style.display = 'none';
        }, 500);
    }, 3000);
}

// #############################################################
// ########################## ALL ##############################
// #############################################################
// Affiche ou masque les div dans all
$(document).ready(function() {
    $('#AccueilBTN').click(function() {
        $('.Accueil').show();
        $('.GestionDesUtilisateurs').hide();
        $('.gestionDesGroupes').hide();
        $('.gestionTaches').hide();
    });
    $('#gestionUtilisateursButton').click(function() {
        $('.Accueil').hide();
        $('.GestionDesUtilisateurs').show();
        $('.gestionDesGroupes').hide();
        $('.gestionTaches').hide();
    });
    $('#gestionGroupesButton').click(function() {
        $('.Accueil').hide();
        $('.GestionDesUtilisateurs').hide();
        $('.gestionDesGroupes').show();
        $('.gestionTaches').hide();
    });
    $('#gestionTachesButton').click(function() {
        $('.Accueil').hide();
        $('.GestionDesUtilisateurs').hide();
        $('.gestionDesGroupes').hide();
        $('.gestionTaches').show();
    });
});



// #############################################################
// ####################### Chaque BTN ##########################
// #############################################################
// Permet d'afficher la liste des groupes en bas à gauche de la page
function creerBoutonGroupe(id_groupe, name, couleur, nb_membre, en_cours) {
    const listeDesGroupes = document.querySelector('.boitegroupes');
    const nouveauGroupe = document.createElement('button');
    nouveauGroupe.classList.add('ajouterGroupeButton');
    nouveauGroupe.dataset.id = id_groupe;
    nouveauGroupe.innerHTML = `
        <div class="ajouterGroupe" id="modifFlex">
            <div class="CouleurDansGroupe" style="background-color: ${couleur};"></div>
            <h1>${name}</h1>
        </div>
    `;
    listeDesGroupes.appendChild(nouveauGroupe);

    nouveauGroupe.addEventListener('click', function() {
        const idGroupe = this.dataset.id;
        cacherContenu(idGroupe, name, nb_membre, en_cours);
    });
}
// Ajout de l'événement pour fermer la nouvelle page
$(document).ready(function() {
    $('#FermerLaPageAddTask').on('click', function() {
        $('.newPageOverlayPourCreerTache').addClass('hide').removeClass('show');
        setTimeout(function() {
            $('.newPageOverlayPourCreerTache').hide();
        }, 500);
        $('.TousCeuxAjoute').empty();
    });
});

// Permet d'afficher la page pour chaque boutons
function cacherContenu(id_groupe, name, nb_membre, en_cours) {
    $('.all').children().hide();

    const nouvelleDiv = document.createElement('div');
    nouvelleDiv.classList.add('nouvelleDiv');
    nouvelleDiv.innerHTML = `
        

        <div class='contain-all-info-haut-tache'>
            <div class='contain-info-haut-tache'>
                <div class='contain-id-tache'>
                    <p style="color: white;">ID ${id_groupe}</p>
                </div>
                <div class='contain-id-tache' id='contain-id-tache2'>
                    <p style="color: white;">${name}</p>
                </div>
                <div class='contain-id-tache' id='contain-id-tache2'>
                    <p style="color: white;">${nb_membre} membres</p>
                </div>
                <i class='bx bxs-plus-square bx-tada-hover' style='color:#ffffff' id="CreerUneTache_${id_groupe}" data-id="${id_groupe}"></i>
            </div>

            <div class='contain-info-haut-tache' id='contain-info-haut-tache-droit'>
                <div class='contain-id-tache'>
                    <p style="color: white;">${en_cours} 🟠</p>
                </div>
                <div class='contain-id-tache'>
                    <p style="color: white;">30 🟢</p>
                </div>
            </div>
        </div>

        <div class='contain-all-taches'>
            <section class='tache-dans-contain-all-taches'>
            </section>
            <section class='tache-dans-contain-all-taches'>
            </section>
            <section class='tache-dans-contain-all-taches'>
            </section>
            <section class='tache-dans-contain-all-taches'>
            </section>
            <section class='tache-dans-contain-all-taches'>
            </section>



        </div>

        
        
        
    `;

    document.querySelector('.all').appendChild(nouvelleDiv);

    // Utiliser la délégation d'événements pour gérer les clics sur toutes les icônes `CreerUneTache`
    $('.all').on('click', `#CreerUneTache_${id_groupe}`, function() {
        const idGroupe = $(this).data('id');
        $('.newPageOverlayPourCreerTache').attr('data-id', idGroupe);
        $('.newPageOverlayPourCreerTache').show();
        setTimeout(function() {
            $('.newPageOverlayPourCreerTache').addClass('show').removeClass('hide');
        }, 10);
    });    
}

$(document).ready(function() {
    $('#FormNouvelleTache').on('submit', function(event) {
        event.preventDefault();
        const idGroupe = $('.newPageOverlayPourCreerTache').attr('data-id');
        const name = $('input.inputNomTache').val().trim();
        const niveau = $('select#niveauTache').val().trim();
        const deadline = $('input#deadlineTache').val().trim();
        if (name === '') {
            afficherPopupErreur('Veuillez entrer un nom');
            return;
        }
        AjouterTache(name,niveau,deadline,idGroupe);
    });

});




function creerSectionTachesDansGroupe(id_tache, nom, description, niveau, deadline) {
    const listeDesGroupesDansListe = document.querySelector('.contain-all-taches');
    const nouveauGroupeDansListe = document.createElement('section');
    nouveauGroupeDansListe.classList.add('tache-dans-contain-all-taches');
    nouveauGroupeDansListe.dataset.idTache = id_tache;
    let niveauColor;
    switch (niveau) {
        case 1:
            niveauColor = 'green';
            break;
        case 2:
            niveauColor = 'orange';
            break;
        case 3:
            niveauColor = 'red';
            break;
        default:
            niveauColor = 'grey';
            break;
    }
    nouveauGroupeDansListe.innerHTML = `
        <div class="LigneDuHaut">
            <div class="CoteGaucheDansGroupe">
                <h1>${id_tache}</h1>
                <h1>${nom}</h1>
                <div class="BulleDeNiveau" style="background-color: ${niveauColor};">
                    <h1>${niveau}</h1>
                </div>
                <h1>${deadline}</h1>
            </div>
            <div class="CoteDroitDansGroupe">
                <i class='bx bxs-chevron-down-circle bx-tada-hover bx-lg' style="color: #FFFFFF;"></i>
            </div>
        </div>
        <div class="SousLigneDuHaut">

            <div class="ListeDesMembresDansSousLigneDuHaut"></div>
            <div class="ListeDesMembresDansSousLigneDuHautAAjouter"></div>

            <div class="ModificationsDansSousLigneDuHaut"></div>
            <button class="EnregistrerLesModificationsBtn">Enregistrer les modifications</button>
            <button class="SupprimerLeGroupeBtn" data-id-tache="${id_tache}" id="SupprimerLaTacheBtn">Supprimer le Groupe</button>
        </div>`;
    listeDesGroupesDansListe.appendChild(nouveauGroupeDansListe);

    const btnSupprimerGroupe = nouveauGroupeDansListe.querySelector('#SupprimerLaTacheBtn');
    btnSupprimerGroupe.addEventListener('click', function() {
        const id_tache = this.dataset.idTache;
        console.log(id_tache);
        supprimerTache(id_tache);
    });

    const icon = nouveauGroupeDansListe.querySelector('.bx.bxs-chevron-down-circle');
    if (icon) {
        icon.addEventListener('click', function() {
            const section = this.closest('.GroupeDansGestion');
            section.classList.toggle('agrandi');
        });
    }
}



// let membresDuGroupe = [];

// function chargerMembresDuGroupePourTache(id_groupe) {
//     $.ajax({
//         type: 'GET',
//         url: url + `/groupes/${id_groupe}/membres`,
//         success: function(response) {
//             if (response.success) {
//                 membresDuGroupe = response.membres;
//                 console.log('Membres du groupe chargés:', membresDuGroupe);
//             } else {
//                 console.error('Erreur lors du chargement des membres du groupe:', response.message);
//             }
//         },
//         error: function() {
//             console.error('Erreur serveur lors du chargement des membres du groupe');
//         }
//     });
// }

// function afficherMembresFiltresTache(recherche, resultatsRechercheTache) {
//     resultatsRechercheTache.innerHTML = '';

//     const membresFiltres = membresDuGroupe.filter(membre => membre.name.toLowerCase().startsWith(recherche));

//     if (membresFiltres.length > 0) {
//         resultatsRechercheTache.style.display = 'block';
//     } else {
//         resultatsRechercheTache.style.display = 'none';
//     }

//     membresFiltres.forEach(membre => {
//         const membreEnAttente = document.createElement('div');
//         membreEnAttente.classList.add('RechercheMembre');
//         membreEnAttente.dataset.id = membre.id_membre;
//         membreEnAttente.innerHTML = `
//             <button data-id="${membre.id_membre}">
//                 <h1>${membre.name}</h1>
//             </button>`;
//         resultatsRechercheTache.appendChild(membreEnAttente);

//         const boutonMembre = membreEnAttente.querySelector('button');
//         boutonMembre.addEventListener('click', function() {
//             assignerMembreATache(membre.id_membre, membre.name);
//         });
//     });
// }

// function assignerMembreATache(id_membre, name) {
//     // Code pour assigner un membre à une tâche
//     console.log(`Membre ${name} (ID: ${id_membre}) assigné à la tâche.`);
// }






















// #############################################################
// #############################################################
// ################# Fenêtre Ajout GROUPE ######################
// #############################################################
// #############################################################
$(document).ready(function() {
    // Griser l'arrière-plan
    $('.ajouterGroupeButton').on('click', function() {
        $('.newPageOverlay').show();
        setTimeout(function() {
            $('.newPageOverlay').addClass('show').removeClass('hide');
        }, 10);
    });
    // Enlever l'assombrissement de l'arrière-plan
    $('.closeNewPage').on('click', function() {
        $('.newPageOverlay').addClass('hide').removeClass('show');
        setTimeout(function() {
            $('.newPageOverlay').hide();
        }, 500);
        $('.TousCeuxAjoute').empty();
    });
    // Afficher ou masquer la liste des membres
    $('.toggle-button').on('click', function() {
        const $list = $(this).closest('.listeDesMembresAAjouter');
        const $list2 = $('#box-groupe-2');
        const $icon = $(this).find('i');
        const $membresADeplacer = $('.LesMembresADeplacer');

        if ($list.hasClass('expanded')) {
            $list.css('height', '48%');
            $list2.css('height', '22%');
            $icon.removeClass('rotated');
            $membresADeplacer.hide();
        } else {
            $list.css('height', '88%');
            $list2.css('height', '90%');
            $icon.addClass('rotated');
            $membresADeplacer.show();
        }
        $list.toggleClass('expanded');
    });
});
// Permet d'ajouter un groupe en base de données
document.addEventListener('DOMContentLoaded', function() {
    const cercleCouleur = document.querySelector('.cercleCouleur');
    const colorPicker = document.getElementById('colorPicker');
    const btnEnregistrerGroupe = document.querySelector('.BoutonEnregistrerGroupe');
    const inputNomDuGroupe = document.querySelector('.inputNomDuGroupe');

    // Gérer l'ouverture du sélecteur de couleurs
    cercleCouleur.addEventListener('click', function() {
        colorPicker.click();
    });

    // Gérer la sélection de couleur
    colorPicker.addEventListener('input', function(event) {
        const newColor = event.target.value;
        cercleCouleur.style.backgroundColor = newColor;
    });

    // Envoyer les données au serveur
    btnEnregistrerGroupe.addEventListener('click', function() {
        const name = inputNomDuGroupe.value;
        const couleur = colorPicker.value;
        // Récupérer les id des membres dans .TousCeuxAjoute
        const membres = Array.from(document.querySelectorAll('.TousCeuxAjoute .NouveauMembreDansListe')).map(el => el.dataset.id);
        
        // Appeler la fonction pour envoyer les données
        AjouterUnGroupe(name, couleur, membres);
    });
});

// Permet de déplacer les membres que l'on souhaite ajouter dans notre nouveau groupe 

document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
        if (event.target.id === 'BtnPourAjouterMembreDansAjouterGroupe') {
            const name = event.target.closest('.coteDroitMembre').previousElementSibling.querySelector('.NameMembre h1').textContent;
            const id = event.target.closest('.coteDroitMembre').dataset.id;
            
            // Vérifier si le membre est déjà dans la liste
            if (document.querySelector(`.TousCeuxAjoute .NouveauMembreDansListe[data-id="${id}"]`)) {
                afficherPopupErreur(name + ' est déjà dans la liste.');
                return;
            }
            const newContent = `
                <div class="NouveauMembreDansListe" data-id="${id}">
                    <div class="coteGaucheMembre">
                        <div class="NameMembre">
                            <h1>${name}</h1>
                        </div>
                    </div>
                    <div class="coteDroitMembre">
                        <i class='bx bxs-minus-circle bx-tada-hover bx-md' id="BtnSupprimerMembreDeListeAjouterGroupe"></i>
                    </div>
                </div>
            `;
            // Ajouter le nouveau contenu dans la div .TousCeuxAjoute
            document.querySelector('.TousCeuxAjoute').insertAdjacentHTML('beforeend', newContent);
            afficherPopupSucces(`${name} ajouté avec succès`);
        }
        // Gérer le clic sur l'icône moins
        if (event.target.id === 'BtnSupprimerMembreDeListeAjouterGroupe') {
            const memberElement = event.target.closest('.NouveauMembreDansListe');
            memberElement.remove();
            // Afficher la popup de succès pour la suppression
            afficherPopupSucces('Le membre a été retiré de la liste.');
        }
    });
});

//Fonction qui va ajouter tous les membres dans le menu déroulant de la fenêtre pour ajouter un groupe justement pour choisir les membres que l'on veut assigner à ce groupe

function ajouterMembreALaListeNouveauGroupe(id_membre, name) {
    const membresADeplacer = document.querySelector('.LesMembresADeplacer');
    const membreEnAttente = document.createElement('div');
    membreEnAttente.classList.add('MembresEnAttente');
    membreEnAttente.dataset.id = id_membre;
    membreEnAttente.innerHTML = `
        <div class="coteGaucheMembre">
            <div class="NameMembre">
                <h1>${name}</h1>
            </div>
        </div>
        <div class="coteDroitMembre" data-id="${id_membre}">
            <i class='bx bxs-plus-circle bx-tada-hover bx-md' id="BtnPourAjouterMembreDansAjouterGroupe"></i>
        </div>`;
    membresADeplacer.appendChild(membreEnAttente);
};
// #############################################################
// #############################################################
// ################### Gestion des Groupes #####################
// #############################################################
// #############################################################

// Permet d'afficher la liste des groupes sur le page Gestion des Groupes

async function creerSectionGroupeAvecMembres(id_groupe, name, couleur, nb_membre) {
    const listeDesGroupesDansListe = document.querySelector('.gestionDesGroupes');
    const nouveauGroupeDansListe = document.createElement('section');
    nouveauGroupeDansListe.classList.add('GroupeDansGestion');
    nouveauGroupeDansListe.dataset.id = id_groupe;
    nouveauGroupeDansListe.innerHTML = `
        <div class="LigneDuHaut">
            <div class="CoteGaucheDansGroupe">
                <div class="BouleDeCouleur" style="background-color: ${couleur};"></div>
                <h1>${id_groupe}</h1>
                <h1>${name}</h1>
                <h1 class="nbMembres">${nb_membre}</h1>
            </div>
            <div class="CoteDroitDansGroupe">
                <i class='bx bxs-chevron-down-circle bx-tada-hover bx-lg' style="color: #FFFFFF;"></i>
            </div>
        </div>
        <div class="SousLigneDuHaut">

            <div class="ListeDesMembresDansSousLigneDuHaut" data-id-groupe="${id_groupe}">
                <input id="rechercheMembre_${id_groupe}" type="text" placeholder="Rechercher un membre...">
                <div id="resultatsRecherche_${id_groupe}" class="resultatsRecherche"></div>
            </div>
            <div class="ListeDesMembresDansSousLigneDuHautAAjouter" id="ListeDesMembresDansSousLigneDuHautAAjouter_${id_groupe}"></div>
            <div class="ModificationsDansSousLigneDuHaut"></div>
            <button class="EnregistrerLesModificationsBtn">Enregistrer les modifications</button>
            <button class="SupprimerLeGroupeBtn" data-id-groupe="${id_groupe}">Supprimer le Groupe</button>
        </div>`;
    listeDesGroupesDansListe.appendChild(nouveauGroupeDansListe);

    const btnSupprimerGroupe = nouveauGroupeDansListe.querySelector('.SupprimerLeGroupeBtn');
    btnSupprimerGroupe.addEventListener('click', function() {
        const id_groupe = this.dataset.idGroupe;
        supprimerGroupe(id_groupe);
    });

    const icon = nouveauGroupeDansListe.querySelector('.bx.bxs-chevron-down-circle');
    if (icon) {
        icon.addEventListener('click', function() {
            const section = this.closest('.GroupeDansGestion');
            section.classList.toggle('agrandi');
        });
    }

    const inputRecherche = document.getElementById(`rechercheMembre_${id_groupe}`);
    const resultatsRecherche = document.getElementById(`resultatsRecherche_${id_groupe}`);

    inputRecherche.addEventListener('input', function() {
        const recherche = inputRecherche.value.toLowerCase();
        if (recherche) {
            afficherMembresFiltres(recherche, resultatsRecherche);
        } else {
            resultatsRecherche.innerHTML = '';
            resultatsRecherche.style.display = 'none'; // Masquer lorsque l'input est vide
        }
    });

    // Charger les membres pour ce groupe spécifique
    chargerMembresGroupes();
}

function ajouterMembreALaListeDansGroupe(id_membre, name, id_groupe) {
    const membresADeplacerDiv = document.getElementById(`ListeDesMembresDansSousLigneDuHautAAjouter_${id_groupe}`);
    if (membresADeplacerDiv) {
        // Vérifier si le membre est déjà présent
        if (!membresADeplacerDiv.querySelector(`[data-id="${id_membre}"]`)) {
            const membreEnAttente = document.createElement('div');
            membreEnAttente.classList.add('MembresEnAttente');
            membreEnAttente.dataset.id = id_membre;
            membreEnAttente.innerHTML = `
                <div class="coteGaucheMembre">
                    <div class="NameMembre">
                        <h1>${name}</h1>
                    </div>
                </div>
                <div class="coteDroitMembre" data-id="${id_membre}">
                    <i class='bx bxs-minus-circle bx-tada-hover bx-md' style="color:#ff3d3d;" id="BtnSupprimerMembreDeListeModifierLeGroupe"></i>
                </div>`;
            membresADeplacerDiv.appendChild(membreEnAttente);

            // Ajouter l'événement click pour supprimer le membre
            const supprimerBtn = membreEnAttente.querySelector('#BtnSupprimerMembreDeListeModifierLeGroupe');
            supprimerBtn.addEventListener('click', function() {
                supprimerMembreModif(id_groupe, id_membre, membreEnAttente, name);
            });
        }
    }
}

// ################### Zone de recherche Membres #####################

document.addEventListener('DOMContentLoaded', function() {
    const champsRecherche = document.querySelectorAll('[id^="rechercheMembre_"]');

    champsRecherche.forEach(inputRecherche => {
        const resultatsRecherche = document.getElementById(`resultatsRecherche_${inputRecherche.dataset.idGroupe}`);

        inputRecherche.addEventListener('input', function() {
            const recherche = inputRecherche.value.toLowerCase();

            if (recherche && id_groupe) {
                afficherMembresFiltres(recherche, resultatsRecherche);
            } else {
                resultatsRecherche.innerHTML = '';
                resultatsRecherche.style.display = 'none';
            }
        });
    });
});

let membres = [];

function afficherMembresFiltres(recherche, resultatsRecherche) {
    resultatsRecherche.innerHTML = ''; // Vider la div avant de réafficher les résultats filtrés

    // Récupérer id_groupe à partir de l'élément parent
    const parentElement = resultatsRecherche.closest('.ListeDesMembresDansSousLigneDuHaut');
    const id_groupe = parentElement ? parentElement.dataset.idGroupe : null; 
    console.log("ID Groupe dans afficherMembresFiltres:", id_groupe); // Log pour vérifier la récupération

    const membresFiltres = membres.filter(membre => membre.name.toLowerCase().startsWith(recherche)); // Utilisation de startsWith

    if (membresFiltres.length > 0) {
        resultatsRecherche.style.display = 'block'; // Afficher si des membres sont trouvés
    } else {
        resultatsRecherche.style.display = 'none'; // Masquer si aucun membre n'est trouvé
    }

    membresFiltres.forEach(membre => {
        const membreEnAttente = document.createElement('div');
        membreEnAttente.classList.add('RechercheMembre');
        membreEnAttente.dataset.id = membre.id;
        membreEnAttente.innerHTML = `
            <button data-id="${membre.id}">
                <h1>${membre.name}</h1>
            </button>`;
        resultatsRecherche.appendChild(membreEnAttente);

        const boutonMembre = membreEnAttente.querySelector('button');
        boutonMembre.addEventListener('click', function() {
            ajouterMembreAuGroupe(membre.id, membre.name, id_groupe);
        });
    });
}


// #############################################################
// #############################################################
// ################# Gestion des Utilisateurs ##################
// #############################################################
// #############################################################

// ################# Fonctionnement ##################
$(document).ready(function() {
    $('#FormNouveauMembre').on('submit', function(event) {
        event.preventDefault();
        const name = $('input.NewMembre').val().trim();
        if (name === '') {
            afficherPopupErreur('Veuillez entrer un nom');
            return;
        }
        AjouterUnMembre(name);
    });
    // Gère l'action du bouton pour supprimer un membre
    $(document).on('click', '.NouveauMembreAjoute-Droit img', function() {
        const idMembre = $(this).closest('.NouveauMembreAjoute').data('id');
        supprimerMembre(idMembre, $(this).closest('.NouveauMembreAjoute'));
    });
});

// ################# Aspect physique ##################

//Fonction qui va ajouter tous les membres dans le menu déroulant de la page pour ajouter un membre

function ajouterMembreALaListeGestion(id_membre, name) {
    const listeDesMembres = document.querySelector('.ListDesMembres');
    const nouveauMembre = document.createElement('div');
    nouveauMembre.classList.add('NouveauMembreAjoute');
    nouveauMembre.dataset.id = id_membre;
    nouveauMembre.innerHTML = `
        <div class="NouveauMembreAjoute-Gauche">
            <div class="NomMembreListe">
                <p>${name}</p>
            </div>
        </div>
        <div class="NouveauMembreAjoute-Droit">
            <img src="../images/close.png" alt="supprimer">
        </div>`;
    listeDesMembres.appendChild(nouveauMembre);
};




// #############################################################
// #############################################################
// #################### Gestion des Tâches #####################
// #############################################################
// #############################################################



// ################# Aspect physique ##################

function creerSectionTaches(id_tache, nom, description, niveau, deadline) {
    const listeDesGroupesDansListe = document.querySelector('.gestionTaches');
    const nouveauGroupeDansListe = document.createElement('section');
    nouveauGroupeDansListe.classList.add('GroupeDansGestion');
    nouveauGroupeDansListe.dataset.idTache = id_tache;
    let niveauColor;
    switch (niveau) {
        case 1:
            niveauColor = 'green';
            break;
        case 2:
            niveauColor = 'orange';
            break;
        case 3:
            niveauColor = 'red';
            break;
        default:
            niveauColor = 'grey';
            break;
    }
    nouveauGroupeDansListe.innerHTML = `
        <div class="LigneDuHaut">
            <div class="CoteGaucheDansGroupe">
                <h1>${id_tache}</h1>
                <h1>${nom}</h1>
                <div class="BulleDeNiveau" style="background-color: ${niveauColor};">
                    <h1>${niveau}</h1>
                </div>
                <h1>${deadline}</h1>
            </div>
            <div class="CoteDroitDansGroupe">
                <i class='bx bxs-chevron-down-circle bx-tada-hover bx-lg' style="color: #FFFFFF;"></i>
            </div>
        </div>
        <div class="SousLigneDuHaut">

            <div class="ListeDesMembresDansSousLigneDuHaut"></div>
            <div class="ListeDesMembresDansSousLigneDuHautAAjouter"></div>

            <div class="ModificationsDansSousLigneDuHaut"></div>
            <button class="EnregistrerLesModificationsBtn">Enregistrer les modifications</button>
            <button class="SupprimerLeGroupeBtn" data-id-tache="${id_tache}" id="SupprimerLaTacheBtn">Supprimer le Groupe</button>
        </div>`;
    listeDesGroupesDansListe.appendChild(nouveauGroupeDansListe);

    const btnSupprimerGroupe = nouveauGroupeDansListe.querySelector('#SupprimerLaTacheBtn');
    btnSupprimerGroupe.addEventListener('click', function() {
        const id_tache = this.dataset.idTache;
        console.log(id_tache);
        supprimerTache(id_tache);
    });

    const icon = nouveauGroupeDansListe.querySelector('.bx.bxs-chevron-down-circle');
    if (icon) {
        icon.addEventListener('click', function() {
            const section = this.closest('.GroupeDansGestion');
            section.classList.toggle('agrandi');
        });
    }
}

















